import { Router } from "express";
import {
  authCallbackController,
  authLoginController,
  verifyGoogleTokenController,
} from "../controllers/oauthController.js";

const oauthRouter = Router();

oauthRouter.get("/auth/google", authLoginController);
oauthRouter.get("/auth/google/callback", authCallbackController);
oauthRouter.get("/auth/google/verify", verifyGoogleTokenController);

export default oauthRouter;
