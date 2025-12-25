# Transport Layer Guide

## Overview

The boilerplate now supports multiple transport protocols with a clean, configuration-driven architecture. This allows you to run HTTP, WebSocket, and gRPC servers simultaneously without coupling presentation logic to server infrastructure.

## Architecture

### Layers

```
Server Layer (server.ts)
    ↓
TransportManager
    ↓
TransportFactory → ITransport implementations
    ↓
[HttpTransport | WebSocketTransport | GrpcTransport]
```

### Key Components

- **`ITransport`**: Abstract interface for all transport protocols
- **`TransportFactory`**: Creates transport instances from configuration
- **`TransportManager`**: Manages lifecycle of all transports
- **`TransportConfig`**: Configuration structure for transports

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# HTTP Transport (required)
PORT=3000

# WebSocket Transport (optional)
ENABLE_WEBSOCKET=true
WEBSOCKET_PORT=3001

# gRPC Transport (optional)
ENABLE_GRPC=true
GRPC_PORT=50051
```

### Transport Configuration File

Configuration is defined in `src/config/transports.config.ts`:

```typescript
export const transportsConfig: TransportConfig[] = [
  {
    type: TransportType.HTTP,
    enabled: true,
    port: Number(process.env.PORT) || 3000,
  },
  {
    type: TransportType.WEBSOCKET,
    enabled: process.env.ENABLE_WEBSOCKET === "true",
    port: Number(process.env.WEBSOCKET_PORT) || 3001,
  },
  {
    type: TransportType.GRPC,
    enabled: process.env.ENABLE_GRPC === "true",
    port: Number(process.env.GRPC_PORT) || 50051,
  },
];
```

## Usage

### Starting the Server

```bash
# HTTP only (default)
bun run dev

# With WebSocket
ENABLE_WEBSOCKET=true bun run dev

# With gRPC
ENABLE_GRPC=true bun run dev

# All transports
ENABLE_WEBSOCKET=true ENABLE_GRPC=true bun run dev
```

### Adding Custom Transports

1. **Define Transport Interface**

```typescript
// src/core/transports/ITransport.ts
export enum TransportType {
  HTTP = "http",
  WEBSOCKET = "websocket",
  GRPC = "grpc",
  MQTT = "mqtt", // Add new type
}
```

2. **Implement Transport**

```typescript
// src/infrastructure/transports/MqttTransport.ts
import type { ITransport } from "../../core/transports/ITransport";
import { TransportType } from "../../core/transports/ITransport";

export interface MqttTransportConfig {
  port: number;
  broker?: string;
}

export class MqttTransport implements ITransport {
  public readonly type = TransportType.MQTT;

  constructor(private readonly config: MqttTransportConfig) {}

  async start(): Promise<void> {
    console.log(`📡 MQTT server started on port ${this.config.port}`);
  }

  async stop(): Promise<void> {
    console.log("MQTT server stopped");
  }
}
```

3. **Register in Factory**

```typescript
// src/infrastructure/transports/TransportFactory.ts
case TransportType.MQTT:
  return new MqttTransport({
    port: config.port,
    ...config.options,
  });
```

4. **Add to Configuration**

```typescript
// src/config/transports.config.ts
{
  type: TransportType.MQTT,
  enabled: process.env.ENABLE_MQTT === "true",
  port: Number(process.env.MQTT_PORT) || 1883,
}
```

## WebSocket Implementation

The WebSocket transport is ready to use. Connect using:

```javascript
const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  ws.send("Hello, server!");
};

ws.onmessage = (event) => {
  console.log("Received:", event.data);
};
```

Customize WebSocket handlers in `src/infrastructure/transports/WebSocketTransport.ts`.

## gRPC Implementation

The gRPC transport is a placeholder. To implement:

1. Install gRPC dependencies:

```bash
bun add @grpc/grpc-js @grpc/proto-loader
```

2. Define your `.proto` files in `src/proto/`

3. Implement service in `src/infrastructure/transports/GrpcTransport.ts`

## Benefits

- **Decoupled**: Server layer independent from presentation
- **Extensible**: Add new protocols without changing existing code
- **Configurable**: Enable/disable via environment variables
- **Type-safe**: Full TypeScript support
- **Testable**: Mock transports for testing
- **Production-ready**: Graceful shutdown handling

## Testing

Test transports individually:

```typescript
import { HttpTransport } from "./infrastructure/transports/HttpTransport";

const transport = new HttpTransport({
  port: 3000,
  fetch: mockFetch,
});

await transport.start();
// ... test
await transport.stop();
```

## Production Deployment

For production, ensure graceful shutdown is configured (already handled in `server.ts`):

```typescript
process.on("SIGINT", async () => {
  await stopServer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await stopServer();
  process.exit(0);
});
```

This ensures all transports properly close connections before the process exits.
