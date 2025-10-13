import express from "express";
import morgan from "morgan";
import routes from "./routes/mainRoute.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";


const createApp = () => {
  const app = express();

  // Middleware
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
