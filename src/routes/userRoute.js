import { Router } from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

const userRouter = Router();

// Token Validation
userRouter.use(validateToken);

// User Routes
userRouter.get("/:id", userController.getUserById);
userRouter.put("/:id", userController.updateUserById);
userRouter.delete("/:id", userController.deleteUserById);

export default userRouter;
