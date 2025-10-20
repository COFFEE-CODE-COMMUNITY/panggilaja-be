import Joi from "joi";

export const createReviewSchema = Joi.object({
  service_id: Joi.string().uuid().required(),
  rating: Joi.number().min(1).max(5).required(),
  komentar: Joi.string().allow("", null),
});
