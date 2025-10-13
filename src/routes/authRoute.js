// routes/auth.js
import { Router } from "express";
import authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/logout", authController.logoutUser);

// reset password
authRouter.post("/request-reset", authController.requestReset);
authRouter.post("/verify-reset-code", authController.verifyReset);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
