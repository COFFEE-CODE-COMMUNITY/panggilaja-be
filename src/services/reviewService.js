import prisma from "../database/prisma.js";
import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";

const createReview = async ({ userId, serviceId, rating, komentar }) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service)
    throw new NotFoundError("Service not found", "SERVICE_NOT_FOUND");

  const orderExist = await prisma.order.findFirst({
    where: {
      buyer_id: userId,
      serviceId,
      status: "completed",
    },
  });

  if (!orderExist)
    throw new ForbiddenError(
      "You can only review completed orders",
      "ORDER_NOT_COMPLETED"
    );

  const existingReview = await prisma.review.findFirst({
    where: {
      user_id: userId,
      serviceId,
    },
  });

  if (existingReview)
    throw new BadRequestError(
      "You have already reviewed this service",
      "REVIEW_DUPLICATE"
    );

  const newReview = await prisma.review.create({
    data: {
      user_id: userId,
      serviceId,
      rating,
      komentar,
    },
  });

  const reviews = await prisma.review.findMany({
    where: { serviceId },
    select: { rating: true },
  });

  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      updated_at: new Date(),
    },
  });

  return newReview;
};

const getReviewsByService = async (serviceId) => {
  const reviews = await prisma.review.findMany({
    where: { serviceId },
    include: {
      user: {
        select: {
          username: true,
          buyerProfile: { select: { foto_buyer: true } },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return reviews;
};

const getReviewsByUser = async (userId) => {
  const reviews = await prisma.review.findMany({
    where: { user_id: userId },
    include: {
      service: {
        select: { nama_jasa: true, foto_product: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return reviews;
};

const getReviewsBySeller = async (seller_id) => {
  // Ambil semua jasa milik seller
  const services = await prisma.service.findMany({
    where: { seller_id },
    select: { id: true, nama_jasa: true },
  });

  if (services.length === 0)
    throw new NotFoundError("Seller has no services", "SELLER_NO_SERVICES");

  const serviceIds = services.map((s) => s.id);

  // Ambil semua review dari semua jasa seller ini
  const reviews = await prisma.review.findMany({
    where: { serviceId: { in: serviceIds } },
    include: {
      user: {
        select: {
          username: true,
          buyerProfile: { select: { foto_buyer: true } },
        },
      },
      service: { select: { id: true, nama_jasa: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return reviews;
};

export default {
  createReview,
  getReviewsByService,
  getReviewsByUser,
  getReviewsBySeller,
};
