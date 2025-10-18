import { Router } from "express";
import orderController from "../controllers/orderController.js";
import validateToken from "../middleware/validateToken.js";

const orderRouter = Router();

// Token Validation
// orderRouter.use(validateToken);

// Seller Routes
orderRouter.get("/:id", orderController.getOrderById);
// orderRouter.get(
//   "/:orderId/services",
//   orderController.getAllServiceByIdorder
// );
// orderRouter.post("/", orderController.addNeworder);
// orderRouter.put("/:id", orderController.updateorderById);
// orderRouter.delete("/:id", orderController.deleteorderById);

export default orderRouter;
