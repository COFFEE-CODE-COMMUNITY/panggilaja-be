import prisma from "@prisma/client";
import BadRequestError from "../exceptions/BadRequestError";
import UnauthorizedError from "../exceptions/UnauthorizedError";

async function newReview(token, { product_id, seller_id, komentar, rating }) {
  if (!komentar || !rating) {
    throw new BadRequestError("Missing input");
  }

  const id = token.user.id;

  if (!id) {
    throw new UnauthorizedError("Id Missing");
  }

  const review = await prisma.review.create({
    data: {
      product_id,
      seller_id,
      rating,
      komentar,
    },
  });

  return review;
}

async function getReview(params) {}

async function getSellerReview(params) {}
