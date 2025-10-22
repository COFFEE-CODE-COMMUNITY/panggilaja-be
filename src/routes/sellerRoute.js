import { Router } from "express";
import sellerController from "../controllers/sellerController.js";
import validateToken from "../middleware/validateToken.js";

const sellerRouter = Router();

// Token Validation
sellerRouter.use(validateToken);

// Seller Routes
sellerRouter.get("/", sellerController.getAllSeller);
sellerRouter.get("/:id", sellerController.getSellerById);
sellerRouter.get("/:id/services", sellerController.getAllServiceByIdSeller);
sellerRouter.post("/", sellerController.addNewSeller);
sellerRouter.put("/:id", sellerController.updateSellerById);
sellerRouter.delete("/:id", sellerController.deleteSellerById);

// Additional
sellerRouter.get("/:id/orders", sellerController.getOrdersBySellerId);

// Docs Routes
sellerRouter.get("/:id/docs", sellerController.getDocsById);
sellerRouter.post("/docs", sellerController.addNewDocs);

export default sellerRouter;
