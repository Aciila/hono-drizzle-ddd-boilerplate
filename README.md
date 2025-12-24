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
├── domain/                     # Domain Layer (Business Logic)
│   ├── entities/               # Domain entities with business rules
│   │   ├── BaseEntity.ts
│   │   └── User.ts
│   └── repositories/           # Repository interfaces (contracts)
│       ├── IBaseRepository.ts
│       └── IUserRepository.ts
│
├── application/                # Application Layer (Use Cases)
│   ├── services/               # Application services
│   │   └── UserService.ts
│   └── usecases/               # Single-responsibility use cases
│       ├── CreateUserUseCase.ts
│       └── GetUserByIdUseCase.ts
│
├── infrastructure/             # Infrastructure Layer (Implementations)
│   └── repositories/           # Repository implementations
│       ├── BaseRepository.ts
│       └── UserRepository.ts
│
├── presentation/               # Presentation Layer (HTTP)
│   ├── routes/                 # API route definitions
│   │   └── user.routes.ts
│   └── schemas/                # Request/Response validation schemas
│       └── user.schema.ts
│
├── database/                   # Database Configuration
│   ├── index.ts                # DB connection
│   ├── schema.ts               # Schema re-exports
│   └── schemas/                # Individual table schemas
│       ├── common.ts
│       ├── users.schema.ts
│       ├── posts.schema.ts
│       └── tags.schema.ts
│
├── config/                     # Configuration
│   └── inversify.config.ts     # DI container bindings
│
├── app/                        # App Setup
│   ├── App.ts                  # Hono app configuration
│   └── errors/                 # Custom error classes
│
└── server.ts                   # Entry point
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

Follow this order when adding a new feature:

### 1. Database Schema

```typescript
// src/database/schemas/products.schema.ts
import { index, pgTable, text, integer } from "drizzle-orm/pg-core";
import { commonColumns } from "./common";

export const products = pgTable(
  "products",
  {
    ...commonColumns,
    name: text().notNull(),
    price: integer().notNull(),
  },
  (table) => [index("products_name_idx").on(table.name)]
);

export type ProductsInsert = typeof products.$inferInsert;
export type ProductsSelect = typeof products.$inferSelect;
```

Then re-export in `src/database/schema.ts`.

### 2. Domain Entity

```typescript
// src/domain/entities/Product.ts
import { BaseEntity } from "./BaseEntity";

export interface IProductProps {
  id: string;
  name: string;
  price: number;
}

export class Product extends BaseEntity {
  private _name: string;
  private _price: number;

  constructor(props: IProductProps) {
    super();
    this.id = props.id;
    this._name = props.name;
    this._price = props.price;
  }

  get name(): string {
    return this._name;
  }
  get price(): number {
    return this._price;
  }

  static create(name: string, price: number): Product {
    return new Product({
      id: BaseEntity.generateId(),
      name,
      price,
    });
  }
}
```

### 3. Repository Interface

```typescript
// src/domain/repositories/IProductRepository.ts
import type { Product } from "../entities/Product";
import type { IBaseRepository } from "./IBaseRepository";

export interface IProductRepository extends IBaseRepository<Product> {
  findByName(name: string): Promise<Product | null>;
}
```

### 4. Repository Implementation

```typescript
// src/infrastructure/repositories/ProductRepository.ts
import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { products } from "../../database/schema";

@injectable()
export class ProductRepository
  extends BaseRepository
  implements IProductRepository
{
  async findById(id: string): Promise<Product | null> {
    const [result] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return result ? this.toDomain(result) : null;
  }

  async save(entity: Product): Promise<void> {
    await this.db.insert(products).values({
      id: entity.id,
      name: entity.name,
      price: entity.price,
    });
  }

  async findByName(name: string): Promise<Product | null> {
    const [result] = await this.db
      .select()
      .from(products)
      .where(eq(products.name, name))
      .limit(1);
    return result ? this.toDomain(result) : null;
  }

  private toDomain(data: typeof products.$inferSelect): Product {
    return new Product({ id: data.id, name: data.name, price: data.price });
  }
}
```

### 5. Use Case

```typescript
// src/application/usecases/CreateProductUseCase.ts
import { injectable, inject } from "inversify";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export interface CreateProductInput {
  name: string;
  price: number;
}

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject("ProductRepository") private productRepository: IProductRepository
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = Product.create(input.name, input.price);
    await this.productRepository.save(product);
    return product;
  }
}
```

### 6. Register in DI Container

```typescript
// src/config/inversify.config.ts
import type { IProductRepository } from "../domain/repositories/IProductRepository";
import { ProductRepository } from "../infrastructure/repositories/ProductRepository";
import { CreateProductUseCase } from "../application/usecases/CreateProductUseCase";

container
  .bind<IProductRepository>("ProductRepository")
  .to(ProductRepository)
  .inSingletonScope();
container
  .bind<CreateProductUseCase>("CreateProductUseCase")
  .to(CreateProductUseCase);
```

### 7. Presentation Schema

```typescript
// src/presentation/schemas/product.schema.ts
import { z } from "zod";

export const CreateProductRequestSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});

export const ProductResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
});
```

### 8. Routes

```typescript
// src/presentation/routes/product.routes.ts
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { container } from "../../config/inversify.config";
import { CreateProductUseCase } from "../../application/usecases/CreateProductUseCase";
import {
  CreateProductRequestSchema,
  ProductResponseSchema,
} from "../schemas/product.schema";

const productsRouter = new OpenAPIHono();

const createProductRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Products"],
  request: {
    body: {
      content: { "application/json": { schema: CreateProductRequestSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: ProductResponseSchema } },
      description: "Created",
    },
  },
});

productsRouter.openapi(createProductRoute, async (c) => {
  const body = c.req.valid("json");
  const useCase = container.get<CreateProductUseCase>("CreateProductUseCase");
  const product = await useCase.execute(body);
  return c.json(product, 201);
});

export { productsRouter };
```

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
