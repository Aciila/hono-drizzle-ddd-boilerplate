import { TransportType } from "../core/transports/ITransport";

export interface TransportConfig {
  type: TransportType;
  enabled: boolean;
  port: number;
  options?: Record<string, unknown>;
}

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
