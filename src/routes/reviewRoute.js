import express from "express";
import reviewController from "../controllers/reviewController.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

router.use(validateToken);

router.post("/service/:orderId", reviewController.createReview);
router.get("/service/:serviceId", reviewController.getReviewsByService);
router.get("/seller/:sellerId", reviewController.getReviewsBySeller);
router.get("/user", reviewController.getBuyerReviews);

export default router;
