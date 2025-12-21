import { injectable, inject } from "inversify";
import type { Context } from "hono";
import { IBaseController } from "../src/presentation/controllers/IBaseController";
import { ICreateUserUseCase } from "./CreateUser.usecase.example";
import { BadRequestException } from "../src/app/errors/AppError";

export interface IUserController extends IBaseController {
  create(c: Context): Promise<Response>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("CreateUserUseCase") private createUserUseCase: ICreateUserUseCase
  ) {}

  async create(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();

      if (!body.email || !body.name) {
        throw new BadRequestException("Email and name are required");
      }

      const result = await this.createUserUseCase.execute({
        email: body.email,
        name: body.name,
      });

      if (!result.success) {
        return c.json({ success: false, error: result.error }, 400);
      }

      return c.json(
        {
          success: true,
          data: {
            id: result.data?.id,
            email: result.data?.email,
            name: result.data?.name,
          },
        },
        201
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        return c.json(
          { success: false, error: error.message },
          error.statusCode
        );
      }

      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
}
