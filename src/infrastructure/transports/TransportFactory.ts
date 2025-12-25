import type { ITransport } from "../../core/transports/ITransport";
import { TransportType } from "../../core/transports/ITransport";
import type { TransportConfig } from "../../config/transports.config";
import { HttpTransport } from "./HttpTransport";
import { WebSocketTransport } from "./WebSocketTransport";
import { GrpcTransport } from "./GrpcTransport";

export const TransportFactory = {
  create(
    config: TransportConfig,
    options?: Record<string, unknown>
  ): ITransport {
    switch (config.type) {
      case TransportType.HTTP:
        return new HttpTransport({
          port: config.port,
          fetch: options?.fetch as (
            request: Request
          ) => Response | Promise<Response>,
          ...config.options,
        });

      case TransportType.WEBSOCKET:
        return new WebSocketTransport({
          port: config.port,
          ...config.options,
        });

      case TransportType.GRPC:
        return new GrpcTransport({
          port: config.port,
          ...config.options,
        });

      default:
        throw new Error(`Unknown transport type: ${config.type}`);
    }
  },
};
