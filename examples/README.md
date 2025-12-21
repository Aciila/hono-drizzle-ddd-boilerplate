# Examples

This directory contains example implementations demonstrating the Clean Architecture patterns used in this boilerplate.

## Files

- **User.entity.example.ts** - Domain entity example
- **UserRepository.example.ts** - Repository interface and implementation
- **CreateUser.usecase.example.ts** - Use case example
- **UserController.example.ts** - Controller example

## Usage

These files are **reference implementations only**. To use them:

1. Copy the patterns to your actual `src/` directory
2. Adjust imports and paths as needed
3. Update the database schema in `src/database/schema.ts`
4. Register dependencies in `src/config/inversify.config.ts`
5. Create routes and wire everything together

## Pattern Flow

```
HTTP Request
    ↓
Controller (UserController)
    ↓
Use Case (CreateUserUseCase)
    ↓
Repository (UserRepository)
    ↓
Database (Drizzle ORM)
```

## Key Principles

1. **Domain Entity** - Contains business logic and validation
2. **Repository Interface** - Defines data access contract
3. **Repository Implementation** - Handles database operations
4. **Use Case** - Orchestrates business flow
5. **Controller** - Handles HTTP concerns

Each layer is independent and testable.
