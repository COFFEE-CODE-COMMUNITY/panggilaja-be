import { Router } from "express";
import docsController from "../controllers/docsController.js";
import validateToken from "../middleware/validateToken.js";

const docsRouter = Router();

// Token Validation
docsRouter.use(validateToken);

// docs Routes
docsRouter.post("/", docsController.addNewDocs);
docsRouter.put("/:id", docsController.updateDocsById);
docsRouter.delete("/:id", docsController.deleteDocsById);

export default docsRouter;
