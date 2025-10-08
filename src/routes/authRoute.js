import { Router } from "express";
import authController from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import authValidation from "../validator/authValidation.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(authValidation),
  authController.registerUser
);
authRouter.post("/login", authController.loginUser);

export default authRouter;
