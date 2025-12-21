import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import { BaseRepository } from "../src/infrastructure/repositories/BaseRepository";
import { IBaseRepository } from "../src/domain/repositories/IBaseRepository";
import { User } from "./User.entity.example";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    // Example implementation - adjust based on your schema
    // const result = await this.db
    //   .select()
    //   .from(usersTable)
    //   .where(eq(usersTable.id, id))
    //   .limit(1)
    //
    // if (result.length === 0) return null
    // return this.toDomain(result[0])

    return null;
  }

  async save(entity: User): Promise<void> {
    // Example implementation - adjust based on your schema
    // const exists = await this.findById(entity.id)
    //
    // if (exists) {
    //   await this.db
    //     .update(usersTable)
    //     .set({ email: entity.email, name: entity.name })
    //     .where(eq(usersTable.id, entity.id))
    // } else {
    //   await this.db
    //     .insert(usersTable)
    //     .values({ id: entity.id, email: entity.email, name: entity.name })
    // }
  }

  async findByEmail(email: string): Promise<User | null> {
    // Example implementation
    // const result = await this.db
    //   .select()
    //   .from(usersTable)
    //   .where(eq(usersTable.email, email))
    //   .limit(1)
    //
    // if (result.length === 0) return null
    // return this.toDomain(result[0])

    return null;
  }

  private toDomain(data: any): User {
    return new User({
      id: data.id,
      email: data.email,
      name: data.name,
    });
  }
}
