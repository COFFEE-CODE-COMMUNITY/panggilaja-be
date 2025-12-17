// router.js

import { Router } from "express";
import sellerController from "../controllers/sellerController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const publicSellerRoute = Router();
publicSellerRoute.get("/", sellerController.getAllSeller);

// ✅ PUBLIC: Allow anyone to view seller details and services
publicSellerRoute.get("/:id", sellerController.getSellerById);
publicSellerRoute.get("/:id/services", sellerController.getAllServiceByIdSeller);

const protectedSellerRoute = Router();
// Token Validation
protectedSellerRoute.use(validateToken);

// Seller Routes
// Seller Routes
// protectedSellerRoute.get("/:id", sellerController.getSellerById); // Moved to public
protectedSellerRoute.post(
  "/",
  upload.single("file"),
  sellerController.addNewSeller
);
protectedSellerRoute.put("/:id", sellerController.updateSellerById);
protectedSellerRoute.delete("/:id", sellerController.deleteSellerById);

// Additional
// ✅ PINDAHKAN KE SINI (Di bawah middleware validateToken)
// Additional
// protectedSellerRoute.get("/:id/services", sellerController.getAllServiceByIdSeller); // Moved to public
protectedSellerRoute.get("/:id/orders", sellerController.getOrdersBySellerId);

// Docs Routes
protectedSellerRoute.get("/:id/docs", sellerController.getDocsById);

export default { publicSellerRoute, protectedSellerRoute };
