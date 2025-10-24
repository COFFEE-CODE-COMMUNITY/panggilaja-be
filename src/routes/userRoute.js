import { Router } from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const userRouter = Router();

// Token Validation
userRouter.use(validateToken);

// User Routes
userRouter.get("/:id", userController.getUserById);
userRouter.get("/:id/addresses", userController.getAddressById);
userRouter.post("/:id/addresses", userController.addNewAddress);
userRouter.put("/:id", upload.single("file"), userController.updateUserById);
userRouter.delete("/:id", userController.deleteUserById);

// Additional
userRouter.get("/:id/orders", userController.getOrdersByUserId);

// Searching
userRouter.get("/:id/services", userController.getServicesByPlace);

// Favorite
userRouter.post("/favorites", userController.addNewFavoriteService);
userRouter.get("/:id/favorites", userController.getFavoriteServices);

// Seller
userRouter.get("/:sellerId/seller", userController.getSellerById);

export default userRouter;
