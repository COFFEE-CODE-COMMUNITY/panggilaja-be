import { Router } from "express";
import sellerController from "../controllers/sellerController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const publicSellerRoute = Router();
publicSellerRoute.get("/", sellerController.getAllSeller);

const protectedSellerRoute = Router();
// Token Validation
protectedSellerRoute.use(validateToken);
// Seller Routes
protectedSellerRoute.get("/:id", sellerController.getSellerById);
protectedSellerRoute.get(
  "/:id/services",
  sellerController.getAllServiceByIdSeller
);
protectedSellerRoute.post(
  "/",
  upload.single("file"),
  sellerController.addNewSeller
);
protectedSellerRoute.put("/:id", sellerController.updateSellerById);
protectedSellerRoute.delete("/:id", sellerController.deleteSellerById);

// Additional
protectedSellerRoute.get("/:id/orders", sellerController.getOrdersBySellerId);

// Docs Routes
protectedSellerRoute.get("/:id/docs", sellerController.getDocsById);

export default { publicSellerRoute, protectedSellerRoute };
