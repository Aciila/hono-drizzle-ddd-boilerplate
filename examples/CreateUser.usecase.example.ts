import { injectable, inject } from "inversify";
import { IUseCase } from "../src/common/types";
import { User } from "./User.entity.example";
import { IUserRepository } from "./UserRepository.example";

export interface ICreateUserInput {
  email: string;
  name: string;
}

export interface ICreateUserOutput {
  success: boolean;
  data?: User;
  error?: string;
}

export interface ICreateUserUseCase
  extends IUseCase<ICreateUserInput, ICreateUserOutput> {}

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async execute(input: ICreateUserInput): Promise<ICreateUserOutput> {
    try {
      const existingUser = await this.userRepository.findByEmail(input.email);

      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        };
      }

      const user = User.create(input.email, input.name);
      await this.userRepository.save(user);

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
