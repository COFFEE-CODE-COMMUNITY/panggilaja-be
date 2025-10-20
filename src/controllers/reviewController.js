import reviewService from "../services/reviewService.js";
import { createReviewSchema } from "../validator/reviewValidation.js";
import BadRequestError from "../exceptions/BadRequestError.js";

const createReview = async (req, res, next) => {
  try {
    // ambil data user dari JWT middleware
    const userId = req.user?.id;
    if (!userId) throw new BadRequestError("Unauthorized", "NO_USER_CONTEXT");

    // validasi body
    const { error, value } = createReviewSchema.validate(req.body);

    if (error)
      throw new BadRequestError(error.details[0].message, "INVALID_PAYLOAD");

    const result = await reviewService.createReview({
      userId,
      ...value,
    });

    res.status(201).json({
      status: "success",
      message: "Review created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getReviewsByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId)
      throw new BadRequestError("serviceId is required", "MISSING_PARAM");

    const reviews = await reviewService.getReviewsByService(serviceId);

    res.status(200).json({
      status: "success",
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

const getUserReviews = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestError("Unauthorized", "NO_USER_CONTEXT");

    const reviews = await reviewService.getReviewsByUser(userId);

    res.status(200).json({
      status: "success",
      message: "User reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

const getReviewsBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId)
      throw new BadRequestError("sellerId is required", "MISSING_PARAM");

    const reviews = await reviewService.getReviewsBySeller(sellerId);

    res.status(200).json({
      status: "success",
      message: "Seller reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createReview,
  getReviewsByService,
  getUserReviews,
  getReviewsBySeller,
};
