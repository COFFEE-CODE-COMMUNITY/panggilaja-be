import { Router } from "express";
import authController from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import authValidation from "../validator/authValidation.js";
import validateToken from "../middleware/validateToken.js";

const authRouter = Router();

// register & login
authRouter.post(
  "/register",
  validate(authValidation.registerSchema),
  authController.registerUser
);
authRouter.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.loginUser
);

// refresh & logout
authRouter.post(
  "/refresh",
  validate(authValidation.refreshSchema),
  authController.refreshToken
);
authRouter.post("/logout", authController.logoutUser);

// reset password flow
authRouter.post(
  "/request-reset",
  validate(authValidation.requestResetSchema),
  authController.requestReset
);
authRouter.post(
  "/verify-reset-code",
  validate(authValidation.verifyResetSchema),
  authController.verifyReset
);
authRouter.post(
  "/reset-password",
  validate(authValidation.resetPasswordSchema),
  authController.resetPassword
);

authRouter.post("/change-user", validateToken, authController.switchUser);

export default authRouter;
