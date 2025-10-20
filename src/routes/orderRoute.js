import { Router } from "express";
import orderController from "../controllers/orderController.js";
import validateToken from "../middleware/validateToken.js";

const orderRouter = Router();

// Token Validation
// orderRouter.use(validateToken);

// Service Routes
orderRouter.post("/", orderController.addNewOrder);
orderRouter.get("/:id", orderController.getOrderById);
orderRouter.put("/:id/status", orderController.updateOrderById);
orderRouter.delete("/:id", orderController.deleteOrderById);

export default orderRouter;
