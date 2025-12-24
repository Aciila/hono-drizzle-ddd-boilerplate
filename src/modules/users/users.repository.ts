import { eq } from "drizzle-orm";
import { db } from "../../database";
import { users } from "../../database/schema";

// =============================================================================
// User Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateUserInput {
  email: string;
  name: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
}

// =============================================================================
// User Repository
// =============================================================================

export class UsersRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }

  /**
   * Get all users with pagination
   */
  async findAll(
    limit: number,
    offset: number
  ): Promise<{ users: User[]; total: number }> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.isActive, true))
      .limit(limit)
      .offset(offset);

    // For simplicity, we're not counting total here
    // In production, you'd want to do a separate count query
    return { users: result, total: result.length };
  }

  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        name: input.name,
        isActive: true,
      })
      .returning();

    console.log(`[UsersRepository] Created user ${user.id}`);
    return user;
  }

  /**
   * Update user
   */
  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set(input)
      .where(eq(users.id, id))
      .returning();

    return user ?? null;
  }

  /**
   * Soft delete user (deactivate)
   */
  async delete(id: string): Promise<boolean> {
    await db
      .update(users)
      .set({ isActive: false, deletedAt: new Date() })
      .where(eq(users.id, id));

    return true;
  }
}

// =============================================================================
// Singleton
// =============================================================================

let instance: UsersRepository | null = null;

export function getUsersRepository(): UsersRepository {
  if (!instance) {
    instance = new UsersRepository();
  }
  return instance;
}
