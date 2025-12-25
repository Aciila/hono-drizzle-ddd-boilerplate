import type { OpenAPIHono } from "@hono/zod-openapi";
import { usersRouter } from "./routes/user.routes";

export interface IPresentationRegistry {
  registerHttpRoutes(app: OpenAPIHono): void;
  registerWebSocketHandlers?(): void;
  registerGrpcServices?(): void;
}

export class PresentationRegistry implements IPresentationRegistry {
  public registerHttpRoutes(app: OpenAPIHono): void {
    app.get("/", (c) => {
      return c.json({ message: "API Boilerplate" });
    });

    app.get("/health", (c) => {
      return c.json({ status: "healthy", timestamp: new Date().toISOString() });
    });

    app.route("/users", usersRouter);
  }

  public registerWebSocketHandlers(): void {}

  public registerGrpcServices(): void {}
}
