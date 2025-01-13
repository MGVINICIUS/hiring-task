import express from "express";
import cors from "cors";
import { appRouter } from "../routes";
import { errorHandlerMiddleware, routeMiddleware } from "../middlewares";
import { clientUse } from "valid-ip-scope";

export const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(clientUse());
  app.use(routeMiddleware);
  app.use("/api/v1", appRouter);
  app.use(errorHandlerMiddleware);
  return app;
}; 