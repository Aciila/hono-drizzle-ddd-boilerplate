# API Boilerplate

Clean Architecture API boilerplate with Domain-Driven Design (DDD) patterns, using **Hono**, **Drizzle ORM**, **InversifyJS**, and **Bun**.

## Features

- 🏗️ **Clean Architecture** with clear separation of concerns
- 🎯 **Domain-Driven Design** patterns
- 💉 **Dependency Injection** using InversifyJS
- 🗄️ **Drizzle ORM** for type-safe database operations
- ⚡ **Hono** - Fast, lightweight web framework
- 📚 **Swagger/OpenAPI** documentation
- 🔍 **Type-safe** with TypeScript
- 🚀 **Bun** runtime for maximum performance

## Architecture

```
src/
├── app/                    # Application layer
│   ├── App.ts             # Main application setup
│   └── errors/            # Custom error classes
├── config/                # Configuration
│   └── inversify.config.ts # DI container
├── database/              # Database layer
│   ├── index.ts           # DB connection
│   ├── schema.ts          # Drizzle schema
│   └── migrations/        # SQL migrations
├── domain/                # Domain layer (business logic)
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── useCases/          # Business use cases
├── infrastructure/        # Infrastructure layer
│   └── repositories/      # Repository implementations
├── presentation/          # Presentation layer
│   ├── controllers/       # HTTP controllers
│   └── routes/            # Route definitions
├── common/                # Shared types and utilities
│   └── types/
├── main.ts                # App entry point
└── server.ts              # Server configuration
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.1.0
- PostgreSQL database

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Edit .env and set your DATABASE_URL
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
NODE_ENV=development
```

### Development

```bash
# Run in development mode with hot reload
bun dev

# Run database migrations
bun run db:migrate

# Generate new migration
bun run db:generate migration_name

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### Production

```bash
# Build the application
bun run build

# Start production server
bun start
```

## API Documentation

Once the server is running, access:

- **Swagger UI**: http://localhost:3000/docs
- **OpenAPI JSON**: http://localhost:3000/docs.json

## Adding New Features

### 1. Create Domain Entity

```typescript
// src/domain/entities/User.ts
import { BaseEntity } from "./BaseEntity";

export class User extends BaseEntity {
  private _name: string;

  constructor(props: { id: string; name: string }) {
    super();
    this.id = props.id;
    this._name = props.name;
  }

  get name(): string {
    return this._name;
  }

  static create(name: string): User {
    return new User({
      id: BaseEntity.generateId(),
      name,
    });
  }
}
```

### 2. Create Repository Interface

```typescript
// src/domain/repositories/IUserRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import { User } from "../entities/User";

export interface IUserRepository extends IBaseRepository<User> {
  findByName(name: string): Promise<User | null>;
}
```

### 3. Implement Repository

```typescript
// src/infrastructure/repositories/UserRepository.ts
import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { users } from "../../database/schema";

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] ? this.toDomain(result[0]) : null;
  }

  async save(entity: User): Promise<void> {
    await this.db.insert(users).values({ id: entity.id, name: entity.name });
  }

  async findByName(name: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.name, name))
      .limit(1);
    return result[0] ? this.toDomain(result[0]) : null;
  }

  private toDomain(data: any): User {
    return new User({ id: data.id, name: data.name });
  }
}
```

### 4. Create Use Case

```typescript
// src/domain/useCases/user/CreateUserUseCase.ts
import { injectable, inject } from "inversify";
import { IUseCase } from "../../../common/types";
import { IUserRepository } from "../../repositories/IUserRepository";
import { User } from "../../entities/User";

interface Input {
  name: string;
}

interface Output {
  success: boolean;
  data?: User;
  error?: string;
}

@injectable()
export class CreateUserUseCase implements IUseCase<Input, Output> {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    try {
      const user = User.create(input.name);
      await this.userRepository.save(user);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
```

### 5. Register in DI Container

```typescript
// src/config/inversify.config.ts
container
  .bind<IUserRepository>("UserRepository")
  .to(UserRepository)
  .inSingletonScope();
container.bind<CreateUserUseCase>("CreateUserUseCase").to(CreateUserUseCase);
```

### 6. Create Controller & Routes

Create your controller and routes following the same pattern.

## Scripts

- `bun dev` - Start development server with hot reload
- `bun start` - Start production server
- `bun run build` - Build for production
- `bun run lint` - Lint code
- `bun run lint:fix` - Fix linting issues
- `bun run format` - Format code
- `bun run typecheck` - Type checking
- `bun test` - Run tests
- `bun run db:generate` - Generate database migration
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio

## Design Patterns

- **Repository Pattern** - Abstract data access
- **Use Case Pattern** - Single responsibility business logic
- **Dependency Injection** - Loose coupling
- **DTO Pattern** - Data transformation
- **Factory Pattern** - Entity creation

## License

MIT
