import "reflect-metadata";
import { App } from "./app/App";
import { PresentationRegistry } from "./presentation/PresentationRegistry";

const appInstance = new App();
const presentationRegistry = new PresentationRegistry();

appInstance.registerPresentationLayer(presentationRegistry);

export const app = appInstance.getApp();

export default app;
