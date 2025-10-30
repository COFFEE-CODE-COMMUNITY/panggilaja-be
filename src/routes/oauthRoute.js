import { Router } from "express";
import {
  authCallbackController,
  authLoginController,
} from "../controllers/oauthController.js";

const oauthRouter = Router();

oauthRouter.get("/auth/google", authLoginController);
oauthRouter.get("/auth/google/callback", authCallbackController);

export default oauthRouter;
