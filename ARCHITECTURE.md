# Architecture Documentation

## Overview

This boilerplate follows **Clean Architecture** principles with **Domain-Driven Design (DDD)** patterns, leveraging **InversifyJS** for dependency injection and **Drizzle ORM** for database operations.

## Project Structure

```
src/
├── app/                 # Application setup and error handling
├── common/              # Shared utilities and helpers
├── config/              # Dependency injection and transport configuration
├── constants/           # Application-wide constants
├── core/                # Core enums, types, and transport interfaces
├── database/            # Database connection and schema
├── domain/              # Business entities and repository interfaces
├── infrastructure/      # Concrete implementations (repositories, transports)
├── modules/             # Feature modules (business logic units)
├── presentation/        # Controllers, routes, and presentation registry
├── services/            # External service integrations
├── main.ts              # Application entry point
└── server.ts            # Server startup and transport initialization
```

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

Interface layer for the application, decoupled from the application core.

**PresentationRegistry** - Central registration for all presentation endpoints

- Registers HTTP routes to the app
- Prepared for WebSocket handlers
- Prepared for gRPC services
- Clean separation from application layer

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

### 6. Modules (`src/modules/`)

Feature-based modules that encapsulate related business logic. Each module contains:

```
modules/
└── users/                  # Example module
    ├── users.schema.ts     # Zod validation schemas (request/response)
    ├── users.repository.ts # Data access layer
    ├── users.service.ts    # Business logic
    ├── users.routes.ts     # HTTP routes with OpenAPI
    └── index.ts            # Public exports
```

**Best Practices:**

- One module per business domain
- Keep modules self-contained
- Export only what's needed via `index.ts`
- Use singleton pattern for services/repositories

### 7. Services (`src/services/`)

External integrations and third-party API clients.

```
services/
├── email/           # Email service (SendGrid, etc.)
├── storage/         # File storage (S3, etc.)
├── queue/           # Job queues (BullMQ, etc.)
└── index.ts
```

### 8. Constants (`src/constants/`)

Application-wide constants and configuration values.

### 9. Core (`src/core/`)

Core enums, types, and shared definitions used across the application.

### 10. Configuration (`src/config/`)

**Dependency Injection** - InversifyJS container

- Register all dependencies
- Singleton vs transient scoping
- Interface-based dependencies

**Transport Configuration** - Multi-protocol support

- Configuration-driven transport setup
- Support for HTTP, WebSocket, and gRPC
- Environment-based enablement
- Port configuration per transport

### 11. Transport Layer (`src/core/transports/` & `src/infrastructure/transports/`)

**Separation of Server and Presentation**

The architecture now cleanly separates server infrastructure from presentation logic:

**Core Transport Interface** (`src/core/transports/`)

- `ITransport` - Abstract transport interface
- `TransportType` - Enum for transport types (HTTP, WebSocket, gRPC)

**Infrastructure Transports** (`src/infrastructure/transports/`)

- `HttpTransport` - HTTP server implementation (Bun)
- `WebSocketTransport` - WebSocket server implementation
- `GrpcTransport` - gRPC server implementation (placeholder)
- `TransportFactory` - Factory for creating transports from config
- `TransportManager` - Manages lifecycle of all transports

**Transport Configuration** (`src/config/transports.config.ts`)

- Declarative transport setup
- Enable/disable transports via environment variables
- Port configuration per transport
- Custom transport options

**Benefits:**

- **Decoupled**: Server layer doesn't depend on presentation details
- **Extensible**: Easy to add new transport protocols
- **Configurable**: Enable/disable transports without code changes
- **Testable**: Each transport can be tested independently
- **Multi-protocol**: Run HTTP, WebSocket, and gRPC simultaneously

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
