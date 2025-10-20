import { Router } from "express";
import sellerController from "../controllers/sellerController.js";
import validateToken from "../middleware/validateToken.js";

const sellerRouter = Router();

// Token Validation
sellerRouter.use(validateToken);

// Seller Routes
sellerRouter.get("/", sellerController.getAllSeller);
sellerRouter.get("/:id", sellerController.getSellerById);
sellerRouter.get(
  "/:sellerId/services",
  sellerController.getAllServiceByIdSeller
);
sellerRouter.post("/", sellerController.addNewSeller);
sellerRouter.put("/:id", sellerController.updateSellerById);
sellerRouter.delete("/:id", sellerController.deleteSellerById);

// Additional
sellerRouter.get("/:sellerId/orders", sellerController.getOrdersBySeller);

export default sellerRouter;
