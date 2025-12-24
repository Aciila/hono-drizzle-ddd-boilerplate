import { z } from "zod";

// =============================================================================
// Request Schemas
// =============================================================================

export const CreateUserRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const UpdateUserRequestSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const GetUserByIdParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export const ListUsersQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});

// =============================================================================
// Response Schemas
// =============================================================================

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export const UsersListResponseSchema = z.object({
  users: z.array(UserResponseSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

// =============================================================================
// Type Exports
// =============================================================================

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
