import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from "../../config/inversify.config";
import type { CreateUserUseCase } from "../../application/usecases/CreateUserUseCase";
import type { GetUserByIdUseCase } from "../../application/usecases/GetUserByIdUseCase";
import type { ListUsersUseCase } from "../../application/usecases/ListUsersUseCase";
import type { UpdateUserUseCase } from "../../application/usecases/UpdateUserUseCase";
import type { DeleteUserUseCase } from "../../application/usecases/DeleteUserUseCase";
import {
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  GetUserByIdParamsSchema,
  ListUsersQuerySchema,
  UserResponseSchema,
  UsersListResponseSchema,
} from "../schemas/user.schema";

// =============================================================================
// Users Router
// =============================================================================

const usersRouter = new OpenAPIHono();

// Resolve use cases from DI container
const createUserUseCase = container.get<CreateUserUseCase>("CreateUserUseCase");
const getUserByIdUseCase =
  container.get<GetUserByIdUseCase>("GetUserByIdUseCase");
const listUsersUseCase = container.get<ListUsersUseCase>("ListUsersUseCase");
const updateUserUseCase = container.get<UpdateUserUseCase>("UpdateUserUseCase");
const deleteUserUseCase = container.get<DeleteUserUseCase>("DeleteUserUseCase");

// GET /users - List all users
const listUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  summary: "List all users",
  request: {
    query: ListUsersQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UsersListResponseSchema,
        },
      },
      description: "List of users",
    },
  },
});

usersRouter.openapi(listUsersRoute, async (c) => {
  const { limit, offset } = c.req.valid("query");
  const result = await listUsersUseCase.execute({ limit, offset });

  return c.json(result, 200);
});

// GET /users/:id - Get user by ID
const getUserByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Users"],
  summary: "Get user by ID",
  request: {
    params: GetUserByIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
      description: "User details",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
      description: "User not found",
    },
  },
});

usersRouter.openapi(getUserByIdRoute, async (c) => {
  const { id } = c.req.valid("param");
  const { user } = await getUserByIdUseCase.execute({ id });

  return c.json(user, 200);
});

// POST /users - Create new user
const createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Users"],
  summary: "Create a new user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
      description: "User created successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
      description: "Validation error",
    },
  },
});

usersRouter.openapi(createUserRoute, async (c) => {
  const body = c.req.valid("json");
  const { user } = await createUserUseCase.execute(body);

  return c.json(user, 201);
});

// PATCH /users/:id - Update user
const updateUserRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Users"],
  summary: "Update user",
  request: {
    params: GetUserByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
      description: "User updated successfully",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
      description: "User not found",
    },
  },
});

usersRouter.openapi(updateUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const { user } = await updateUserUseCase.execute({ id, ...body });

  return c.json(user, 200);
});

// DELETE /users/:id - Delete user
const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Users"],
  summary: "Delete user",
  request: {
    params: GetUserByIdParamsSchema,
  },
  responses: {
    204: {
      description: "User deleted successfully",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
      description: "User not found",
    },
  },
});

usersRouter.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  await deleteUserUseCase.execute({ id });

  return c.body(null, 204);
});

export { usersRouter };
