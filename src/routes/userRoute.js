import { Router } from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const publicUserRouter = Router();
// Seller
publicUserRouter.get("/:sellerId/seller", userController.getSellerById);
// Searching
publicUserRouter.get("/:id/services", userController.getServicesByPlace);

const protectedUserRoute = Router();
// Token Validation
protectedUserRoute.use(validateToken);

// User Routes
protectedUserRoute.get("/:id", userController.getUserById);
protectedUserRoute.get("/:id/addresses", userController.getAddressById);
protectedUserRoute.post("/:id/addresses", userController.addNewAddress);
protectedUserRoute.delete("/:id/addresses", userController.deleteAddressById);
protectedUserRoute.put(
  "/:id",
  upload.single("file"),
  userController.updateUserById
);
protectedUserRoute.delete("/:id", userController.deleteUserById);

// Additional
protectedUserRoute.get("/:id/orders", userController.getOrdersByUserId);

// Favorite
protectedUserRoute.post("/favorites", userController.addNewFavoriteService);
protectedUserRoute.get("/:id/favorites", userController.getFavoriteServices);

export default { publicUserRouter, protectedUserRoute };
