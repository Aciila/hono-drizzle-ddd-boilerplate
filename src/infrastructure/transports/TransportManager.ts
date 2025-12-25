import type { ITransport } from "../../core/transports/ITransport";
import type { TransportConfig } from "../../config/transports.config";
import { TransportFactory } from "./TransportFactory";

export class TransportManager {
  private transports: ITransport[] = [];

  constructor(
    private readonly configs: TransportConfig[],
    private readonly options?: Record<string, unknown>
  ) {}

  async startAll(): Promise<void> {
    console.log("🚀 Initializing transports...");

    const enabledConfigs = this.configs.filter((config) => config.enabled);

    if (enabledConfigs.length === 0) {
      console.warn("⚠️  No transports enabled");
      return;
    }

    for (const config of enabledConfigs) {
      try {
        const transport = TransportFactory.create(config, this.options);
        await transport.start();
        this.transports.push(transport);
      } catch (error) {
        console.error(`Failed to start ${config.type} transport:`, error);
        throw error;
      }
    }

    console.log(`✅ Started ${this.transports.length} transport(s)`);
  }

  async stopAll(): Promise<void> {
    console.log("⏹️  Stopping all transports...");

    for (const transport of this.transports) {
      try {
        await transport.stop();
      } catch (error) {
        console.error(`Failed to stop ${transport.type} transport:`, error);
      }
    }

    this.transports = [];
    console.log("✅ All transports stopped");
  }

  getTransports(): ITransport[] {
    return [...this.transports];
  }
}
