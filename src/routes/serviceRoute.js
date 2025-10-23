import { Router } from "express";
import serviceController from "../controllers/serviceController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const serviceRouter = Router();

// Token Validation
serviceRouter.use(validateToken);

// Service Routes
serviceRouter.get("/category", serviceController.getAllKategori);

serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/:id", serviceController.getServiceById); //api/services/:id
serviceRouter.post(
  "/",
  upload.single("file"),
  serviceController.addItemService
);
serviceRouter.put("/:id", serviceController.updateServiceById);
serviceRouter.delete("/:id", serviceController.deleteServiceById);

export default serviceRouter;
