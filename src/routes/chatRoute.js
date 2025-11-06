import { Router } from "express";
import chatController from "../controllers/chatController.js";
import validateToken from "../middleware/validateToken.js";

const chatRouter = Router();

// Token Validation
chatRouter.use(validateToken);

// Chat Routes
// buyer
chatRouter.get("/:buyerId/buyer", chatController.getSellersForSidebar);
// seller
chatRouter.get("/:sellerId/seller", chatController.getBuyersForSidebar);
// Rute "greedy" (umum) harus di BAWAH biar ga KETIMPA ASEMM GAGAL TERNYATA KARENA KETIMPA
chatRouter.get("/:id", chatController.getMessages);
chatRouter.post("/", chatController.sendMessage);

export default chatRouter;
