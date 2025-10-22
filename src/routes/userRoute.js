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
userRouter.get("/:id/orders", userController.getOrdersByUserId);

// Searching
userRouter.get("/:id/services", userController.getServicesByPlace);

// Favorite
userRouter.post("/favorites", userController.addNewFavoriteService);
userRouter.get("/:id/favorites", userController.getFavoriteServices);

export default userRouter;
