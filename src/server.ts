import app from "./main";
import { TransportManager } from "./infrastructure/transports/TransportManager";
import { transportsConfig } from "./config/transports.config";

const transportManager = new TransportManager(transportsConfig, {
  fetch: app.fetch,
});

async function startServer() {
  console.log("🚀 Starting server with transports...");
  await transportManager.startAll();
}

async function stopServer() {
  console.log("⏹️  Stopping server...");
  await transportManager.stopAll();
}

process.on("SIGINT", async () => {
  await stopServer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await stopServer();
  process.exit(0);
});

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};
