export enum TransportType {
  HTTP = "http",
  WEBSOCKET = "websocket",
  GRPC = "grpc",
}

export interface ITransport {
  readonly type: TransportType;
  start(): Promise<void>;
  stop(): Promise<void>;
}
