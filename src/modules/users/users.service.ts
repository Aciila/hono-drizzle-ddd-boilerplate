import {
  NotFoundException,
  BadRequestException,
} from "../../app/errors/AppError";
import {
  type UsersRepository,
  type User,
  type CreateUserInput,
  type UpdateUserInput,
  getUsersRepository,
} from "./users.repository";

// =============================================================================
// Users Service Types
// =============================================================================

export interface UsersListResult {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

// =============================================================================
// Users Service
// =============================================================================

export class UsersService {
  private usersRepo: UsersRepository;

  constructor(deps?: { usersRepo?: UsersRepository }) {
    this.usersRepo = deps?.usersRepo ?? getUsersRepository();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepo.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Get all users with pagination
   */
  async getUsers(limit: number, offset: number): Promise<UsersListResult> {
    const result = await this.usersRepo.findAll(limit, offset);

    return {
      users: result.users,
      total: result.total,
      limit,
      offset,
    };
  }

  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepo.findByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const user = await this.usersRepo.create(input);
    console.log(`[UsersService] User ${user.id} created`);

    return user;
  }

  /**
   * Update user
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    // Check if user exists
    const existingUser = await this.usersRepo.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check email uniqueness if updating email
    if (input.email && input.email !== existingUser.email) {
      const emailTaken = await this.usersRepo.findByEmail(input.email);
      if (emailTaken) {
        throw new BadRequestException("Email is already taken");
      }
    }

    const user = await this.usersRepo.update(id, input);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    console.log(`[UsersService] User ${id} updated`);
    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepo.delete(id);
    console.log(`[UsersService] User ${id} deleted`);
  }
}

// =============================================================================
// Singleton
// =============================================================================

let instance: UsersService | null = null;

export function getUsersService(): UsersService {
  if (!instance) {
    instance = new UsersService();
  }
  return instance;
}
