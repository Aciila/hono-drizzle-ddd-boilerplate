import type { ITransport } from "../../core/transports/ITransport";
import { TransportType } from "../../core/transports/ITransport";

export interface WebSocketTransportConfig {
  port: number;
}

export class WebSocketTransport implements ITransport {
  public readonly type = TransportType.WEBSOCKET;
  private server?: ReturnType<typeof Bun.serve>;

  constructor(private readonly config: WebSocketTransportConfig) {}

  async start(): Promise<void> {
    this.server = Bun.serve({
      port: this.config.port,
      fetch(req, server) {
        const success = server.upgrade(req, {
          data: {
            createdAt: Date.now(),
          },
        });

        if (success) {
          return undefined;
        }

        return new Response("WebSocket upgrade failed", { status: 400 });
      },
      websocket: {
        open(ws) {
          console.log("WebSocket connection opened");
        },
        message(ws, message) {
          console.log("WebSocket message received:", message);
          ws.send(`Echo: ${message}`);
        },
        close(ws) {
          console.log("WebSocket connection closed");
        },
      },
    });

    console.log(`🔌 WebSocket server started on port ${this.config.port}`);
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.stop();
      console.log("WebSocket server stopped");
    }
  }
}
