import type { User } from "../entities/User";
import type { IBaseRepository, IFindItemsDataSet } from "./IBaseRepository";

// =============================================================================
// User Repository Interface
// =============================================================================
//
// Defines the contract for User data access.
// Implemented in: src/infrastructure/repositories/UserRepository.ts

export interface CreateUserData {
  email: string;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findAll(limit: number, offset: number): Promise<IFindItemsDataSet<User>>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
