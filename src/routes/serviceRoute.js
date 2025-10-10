import { Router } from "express";
import serviceController from "../controllers/serviceController.js";
import validateToken from "../middleware/validateToken.js";

const serviceRouter = Router();

// Token Validation
serviceRouter.use(validateToken);

// Service Routes
serviceRouter.post("/", serviceController.addService);

export default serviceRouter;
