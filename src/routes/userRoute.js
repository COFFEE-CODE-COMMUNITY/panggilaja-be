import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const userRouter = Router();

userRouter.get("/me", authMiddleware, userController.getById);

export default userRouter;
