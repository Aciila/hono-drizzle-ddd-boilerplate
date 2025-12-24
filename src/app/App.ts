import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { injectable } from "inversify";
import { AppError } from "./errors/AppError";
import { usersRouter } from "../modules/users";

export interface IApp {
  getApp(): OpenAPIHono;
}

@injectable()
export class App implements IApp {
  private readonly app: OpenAPIHono;

  constructor() {
    this.app = new OpenAPIHono();

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
    this.configureSwagger();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
  }

  private configureRoutes(): void {
    this.app.get("/", (c) => {
      return c.json({ message: "API Boilerplate" });
    });

    this.app.get("/health", (c) => {
      return c.json({ status: "healthy", timestamp: new Date().toISOString() });
    });

    // Mount module routes
    this.app.route("/users", usersRouter);
  }

  private configureErrorHandling(): void {
    this.app.notFound((c) =>
      c.json({ success: false, message: "No Such Route" }, 404)
    );

    this.app.onError((err, c) => {
      if (err instanceof AppError) {
        return c.json(
          {
            success: false,
            message: err.message,
            errorType: err.errorType,
          },
          err.statusCode as any
        );
      }

      console.error(err);
      return c.json({ success: false, message: err.message }, 500);
    });
  }

  private configureSwagger(): void {
    this.app.doc("/docs.json", {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "API Boilerplate Documentation",
      },
    });

    this.app.get(
      "/docs",
      swaggerUI({
        url: "/docs.json",
        persistAuthorization: true,
      })
    );
  }

  public getApp(): OpenAPIHono {
    return this.app;
  }
}
