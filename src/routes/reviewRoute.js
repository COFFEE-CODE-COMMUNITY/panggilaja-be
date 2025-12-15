import express from "express";
import reviewController from "../controllers/reviewController.js";
import validateToken from "../middleware/validateToken.js";

const publicReviewRouter = express.Router();
const protectedReviewRouter = express.Router();

// Public Routes (No Token Required)
publicReviewRouter.get("/service/:serviceId", reviewController.getReviewsByService);
publicReviewRouter.get("/seller/:sellerId", reviewController.getReviewsBySeller);

// Protected Routes (Token Required)
protectedReviewRouter.use(validateToken);
protectedReviewRouter.post("/service/:orderId", reviewController.createReview);
protectedReviewRouter.get("/user", reviewController.getBuyerReviews);

export default { publicReviewRouter, protectedReviewRouter };
