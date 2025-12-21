# Architecture Documentation

## Overview

This boilerplate follows **Clean Architecture** principles with **Domain-Driven Design (DDD)** patterns, leveraging **InversifyJS** for dependency injection and **Drizzle ORM** for database operations.

## Layers

### 1. Domain Layer (`src/domain/`)

The core business logic layer, independent of frameworks and external dependencies.

**Entities** - Business objects with behavior and state

- Extend `BaseEntity`
- Encapsulate business rules
- Use private properties with getters
- Factory methods for creation

**Repositories** - Interfaces defining data access contracts

- Define the contract, not implementation
- Return domain entities
- Keep database-agnostic

**Use Cases** - Application-specific business rules

- Single responsibility per use case
- Coordinate between entities and repositories
- Enforce business rules
- Handle errors gracefully

### 2. Application Layer (`src/app/`)

Coordinates application flow and transforms data.

**App.ts** - Main application setup

- Configure middleware
- Define routes
- Error handling
- Swagger documentation

**Errors** - Custom error classes

- Extend `AppError`
- HTTP status codes
- Error types

### 3. Infrastructure Layer (`src/infrastructure/`)

Implements interfaces defined in the domain layer.

**Repositories** - Concrete implementations

- Extend `BaseRepository`
- Map between database models and domain entities
- Handle persistence logic

### 4. Presentation Layer (`src/presentation/`)

HTTP interface for the application.

**Controllers** - Handle HTTP requests

- Extract request data
- Execute use cases
- Return responses
- Handle errors

**Routes** - Define API endpoints

- Map endpoints to controllers
- Group related routes

### 5. Database (`src/database/`)

**Schema** - Drizzle ORM table definitions

- Define tables with type safety
- Common columns pattern
- Indexes and constraints

**Migrations** - Version control for database

- Generated from schema changes
- Applied sequentially

### 6. Configuration (`src/config/`)

**Dependency Injection** - InversifyJS container

- Register all dependencies
- Singleton vs transient scoping
- Interface-based dependencies

## Key Principles

### Dependency Rule

Dependencies point inward. Inner layers don't know about outer layers.

```
Presentation -> Application -> Domain
Infrastructure -> Domain
```

### Separation of Concerns

Each layer has a specific responsibility:

- **Domain**: Business logic
- **Application**: Orchestration
- **Infrastructure**: External implementations
- **Presentation**: HTTP interface

### Dependency Inversion

Depend on abstractions (interfaces), not concretions.

## Best Practices

1. **Entity Design**

   - Keep entities focused on business logic
   - Use private properties with getters
   - Avoid anemic domain models

2. **Use Cases**

   - One use case per operation
   - Return structured results
   - Keep use cases testable

3. **Repositories**

   - Return domain entities, not database models
   - Keep database logic isolated
   - Use proper error handling

4. **Controllers**

   - Thin controllers (orchestration only)
   - Delegate to use cases
   - Proper HTTP status codes

5. **Dependency Injection**
   - Depend on abstractions
   - Register dependencies in one place
   - Use appropriate scoping

## Testing Strategy

- **Unit Tests**: Test use cases with mocked repositories
- **Integration Tests**: Test repositories with database
- **E2E Tests**: Test API endpoints

## Common Pitfalls to Avoid

❌ Don't:

- Put business logic in controllers
- Access database directly from use cases
- Create circular dependencies
- Mix layers (skip layers)

✅ Do:

- Keep layers separated
- Use dependency injection
- Write testable code
- Follow single responsibility
- Use proper error handling
