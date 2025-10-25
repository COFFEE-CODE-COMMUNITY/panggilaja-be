import { Router } from "express";
import serviceController from "../controllers/serviceController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const publicServiceRouter = Router();
publicServiceRouter.get("/category", serviceController.getAllKategori);
publicServiceRouter.get("/", serviceController.getAllServices);
publicServiceRouter.get("/:id", serviceController.getServiceById);

const protectedServiceRouter = Router();
// Token Validation
protectedServiceRouter.use(validateToken);
// Service Routes
protectedServiceRouter.post(
  "/",
  upload.single("file"),
  serviceController.addItemService
);
protectedServiceRouter.put("/:id", serviceController.updateServiceById);
protectedServiceRouter.delete("/:id", serviceController.deleteServiceById);

export default { publicServiceRouter, protectedServiceRouter };
