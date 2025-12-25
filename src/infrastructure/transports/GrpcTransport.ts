import type { ITransport } from "../../core/transports/ITransport";
import { TransportType } from "../../core/transports/ITransport";

export interface GrpcTransportConfig {
  port: number;
}

export class GrpcTransport implements ITransport {
  public readonly type = TransportType.GRPC;

  constructor(private readonly config: GrpcTransportConfig) {}

  async start(): Promise<void> {
    console.log(`📡 gRPC server would start on port ${this.config.port}`);
  }

  async stop(): Promise<void> {
    console.log("gRPC server stopped");
  }
}
