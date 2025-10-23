import express from "express";
import morgan from "morgan";
import routes from "./routes/mainRoute.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "../swagger.js";
import YAML from "yamljs";

import cookieParser from "cookie-parser";
// import oauthRouter from "./routes/oauthService.js";

const createApp = () => {
  const app = express();

  // Middleware
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  const swaggerDocument = YAML.load("./openapi.yaml");
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());

  // Routes
  app.use("/api", routes);

  // Error Handling
  app.use(errorMiddleware);

  return app;
};

export default createApp;
