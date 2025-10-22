import express from "express";
import morgan from "morgan";
import routes from "./routes/mainRoute.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./utils/oauth/passport.js";

const createApp = () => {
  const app = express();

  // Middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
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
