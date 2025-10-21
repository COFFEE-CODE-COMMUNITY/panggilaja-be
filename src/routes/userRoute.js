import { Router } from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

const userRouter = Router();

// Token Validation
userRouter.use(validateToken);

// User Routes
userRouter.get("/:id", userController.getUserById);
userRouter.get("/:id/addresses", userController.getAddressById);
userRouter.put("/:id", userController.updateUserById);
userRouter.delete("/:id", userController.deleteUserById);

// Additional
userRouter.get("/:userId/orders", userController.getOrdersByUserId);

// Searching
userRouter.get("/:userId/services", userController.getServicesByPlace);

export default userRouter;
