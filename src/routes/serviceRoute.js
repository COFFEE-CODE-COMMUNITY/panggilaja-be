import { Router } from "express";
import serviceController from "../controllers/serviceController.js";
import validateToken from "../middleware/validateToken.js";

const serviceRouter = Router();

// Token Validation
serviceRouter.use(validateToken);

// Service Routes
serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/:id", serviceController.getServiceById);
serviceRouter.post("/", serviceController.addItemService);
serviceRouter.put("/:id", serviceController.updateServiceById);
serviceRouter.delete("/:id", serviceController.deleteServiceById);

export default serviceRouter;
