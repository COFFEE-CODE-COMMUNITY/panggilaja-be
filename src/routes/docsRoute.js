import { Router } from "express";
import docsController from "../controllers/docsController.js";
import validateToken from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const docsRouter = Router();

docsRouter.use(validateToken);

docsRouter.post("/seller", upload.single("file"), docsController.addNewDocs);
docsRouter.get("/seller", docsController.getSellerDocs);
docsRouter.put("/:id", docsController.updateDocsById);
docsRouter.delete("/:id", docsController.deleteDocsById);

export default docsRouter;
