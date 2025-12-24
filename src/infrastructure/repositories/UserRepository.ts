import { injectable } from "inversify";
import { eq, isNull, and } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import type { IFindItemsDataSet } from "../../domain/repositories/IBaseRepository";
import type {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { users } from "../../database/schema";

// =============================================================================
// User Repository Implementation
// =============================================================================
//
// Handles all database operations for User entity.
// Implements IUserRepository interface from domain layer.

type UserRecord = typeof users.$inferSelect;

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  // ---------------------------------------------------------------------------
  // Find by ID
  // ---------------------------------------------------------------------------

  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;
    return this.toDomain(result[0]);
  }

  // ---------------------------------------------------------------------------
  // Find by Email
  // ---------------------------------------------------------------------------

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;
    return this.toDomain(result[0]);
  }

  // ---------------------------------------------------------------------------
  // Find All (Paginated)
  // ---------------------------------------------------------------------------

  async findAll(
    limit: number,
    offset: number
  ): Promise<IFindItemsDataSet<User>> {
    const whereCondition = and(
      eq(users.isActive, true),
      isNull(users.deletedAt)
    );

    const rows = await this.db
      .select()
      .from(users)
      .where(whereCondition)
      .limit(limit)
      .offset(offset);

    const countResult = await this.db
      .select()
      .from(users)
      .where(whereCondition);

    return {
      rows: rows.map((row) => this.toDomain(row)),
      count: countResult.length,
    };
  }

  // ---------------------------------------------------------------------------
  // Save (from IBaseRepository)
  // ---------------------------------------------------------------------------

  async save(entity: User): Promise<void> {
    const exists = await this.findById(entity.id);

    if (exists) {
      await this.db
        .update(users)
        .set({
          email: entity.email,
          name: entity.name,
          isActive: entity.isActive,
        })
        .where(eq(users.id, entity.id));
    } else {
      await this.db.insert(users).values({
        id: entity.id,
        email: entity.email,
        name: entity.name,
        isActive: entity.isActive,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  async create(data: CreateUserData): Promise<User> {
    const [record] = await this.db
      .insert(users)
      .values({
        email: data.email,
        name: data.name,
        isActive: true,
      })
      .returning();

    return this.toDomain(record);
  }

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const [record] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    if (!record) return null;
    return this.toDomain(record);
  }

  // ---------------------------------------------------------------------------
  // Delete (Soft)
  // ---------------------------------------------------------------------------

  async delete(id: string): Promise<boolean> {
    await this.db
      .update(users)
      .set({ isActive: false, deletedAt: new Date() })
      .where(eq(users.id, id));

    return true;
  }

  // ---------------------------------------------------------------------------
  // Domain Mapper
  // ---------------------------------------------------------------------------

  private toDomain(record: UserRecord): User {
    return new User({
      id: record.id,
      email: record.email,
      name: record.name,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

// =============================================================================
// Singleton (for non-DI usage)
// =============================================================================

let instance: UserRepository | null = null;

export function getUserRepository(): UserRepository {
  if (!instance) {
    instance = new UserRepository();
  }
  return instance;
}
