import type { ITransport } from "../../core/transports/ITransport";
import { TransportType } from "../../core/transports/ITransport";

export interface HttpTransportConfig {
  port: number;
  fetch: (request: Request) => Response | Promise<Response>;
}

export class HttpTransport implements ITransport {
  public readonly type = TransportType.HTTP;
  private server?: ReturnType<typeof Bun.serve>;

  constructor(private readonly config: HttpTransportConfig) {}

  async start(): Promise<void> {
    this.server = Bun.serve({
      port: this.config.port,
      fetch: this.config.fetch,
    });

    console.log(`🚀 HTTP server started on port ${this.config.port}`);
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.stop();
      console.log("HTTP server stopped");
    }
  }
}
