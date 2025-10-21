import { Router } from "express";
import favoriteController from "../controllers/favoriteController.js";
import validateToken from "../middleware/validateToken.js";

const favoriteRouter = Router();

// Token Validation
favoriteRouter.use(validateToken);

// favorite Routes
favoriteRouter.delete("/:id", favoriteController.deletefavoriteById);

export default favoriteRouter;
