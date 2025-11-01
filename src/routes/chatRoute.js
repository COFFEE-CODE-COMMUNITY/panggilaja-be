import { Router } from "express";
import chatController from "../controllers/chatController.js";
import validateToken from "../middleware/validateToken.js";

const chatRouter = Router();

// Token Validation
chatRouter.use(validateToken);

// Chat Routes
chatRouter.post("/", chatController.sendMessage);
chatRouter.get("/:id", chatController.getMessages);
// buyer
chatRouter.get("/:buyerId/buyer", chatController.getSellersForSidebar);
// seller
chatRouter.get("/:sellerId/seller", chatController.getBuyersForSidebar);

export default chatRouter;
