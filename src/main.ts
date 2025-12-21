import "reflect-metadata";
import { App } from "./app/App";

const appInstance = new App();
export const app = appInstance.getApp();

export default app;
