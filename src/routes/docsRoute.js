import { Router } from "express";
import docsController from "../controllers/docsController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const docsRouter = Router();

// Token Validation
docsRouter.use(validateToken);

// docs Routes
docsRouter.post("/", upload.single("file"), docsController.addNewDocs);
docsRouter.put("/:id", docsController.updateDocsById);
docsRouter.delete("/:id", docsController.deleteDocsById);

export default docsRouter;
