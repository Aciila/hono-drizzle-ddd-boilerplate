import "reflect-metadata";
import { Container } from "inversify";

// =============================================================================
// Imports
// =============================================================================
import type { IUserRepository } from "../domain/repositories/IUserRepository";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from "../application/usecases";

const container = new Container();

// =============================================================================
// Dependency Injection Setup
// =============================================================================
//
// How to register and inject dependencies:
//
// 1. Define interface in domain layer:
//    Location: src/domain/repositories/IUserRepository.ts
//
//    export interface IUserRepository extends IBaseRepository<User> {
//      findByEmail(email: string): Promise<User | null>;
//    }
//
// 2. Create implementation with @injectable() decorator:
//    Location: src/infrastructure/repositories/UserRepository.ts
//
//    @injectable()
//    export class UserRepository extends BaseRepository implements IUserRepository {
//      async findByEmail(email: string): Promise<User | null> { ... }
//    }
//
// 3. Register the binding below:
//    container.bind<IUserRepository>("UserRepository").to(UserRepository);
//
// 4. Inject in consumer class using @inject():
//    Location: src/modules/users/users.usecase.ts
//
//    @injectable()
//    export class CreateUserUseCase {
//      constructor(
//        @inject("UserRepository") private userRepository: IUserRepository
//      ) {}
//    }
//
// =============================================================================

// =============================================================================
// Injection Tokens
// =============================================================================
//
// Use symbols for type-safe injection tokens:
//
// export const TYPES = {
//   UserRepository: Symbol.for("UserRepository"),
//   CreateUserUseCase: Symbol.for("CreateUserUseCase"),
// };

// =============================================================================
// Repository Bindings
// =============================================================================

container
  .bind<IUserRepository>("UserRepository")
  .to(UserRepository)
  .inSingletonScope();

// =============================================================================
// Use Case Bindings
// =============================================================================

container.bind<CreateUserUseCase>("CreateUserUseCase").to(CreateUserUseCase);
container.bind<GetUserByIdUseCase>("GetUserByIdUseCase").to(GetUserByIdUseCase);
container.bind<ListUsersUseCase>("ListUsersUseCase").to(ListUsersUseCase);
container.bind<UpdateUserUseCase>("UpdateUserUseCase").to(UpdateUserUseCase);
container.bind<DeleteUserUseCase>("DeleteUserUseCase").to(DeleteUserUseCase);

export { container };
