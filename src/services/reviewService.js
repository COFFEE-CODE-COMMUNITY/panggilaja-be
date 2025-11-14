import prisma from "../database/prisma.js";
import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";

const createReview = async ({ userId, orderId, rating, komentar }) => {
  // First, get the order to validate it's completed and get the service_id
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order)
    throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");

  // Check if the order belongs to the user and is completed
  if (order.buyer_id !== userId || order.status !== "completed")
    throw new ForbiddenError(
      "You can only review your completed orders",
      "ORDER_NOT_COMPLETED"
    );

  const serviceId = order.service_id;

  // Check if service exists
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service)
    throw new NotFoundError("Service not found", "SERVICE_NOT_FOUND");

  // Check if user has already reviewed this service
  const existingReview = await prisma.review.findFirst({
    where: {
      user_id: userId,
      service_id: serviceId,
    },
  });

  if (existingReview)
    throw new BadRequestError(
      "You have already reviewed this service",
      "REVIEW_DUPLICATE"
    );

  // Create the new review
  const newReview = await prisma.review.create({
    data: {
      user_id: userId,
      service_id: serviceId,
      rating,
      komentar,
    },
  });

  // Calculate new average rating for the service
  const reviews = await prisma.review.findMany({
    where: { service_id: serviceId },
    select: { rating: true },
  });

  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  // Update service with new average rating
  await prisma.service.update({
    where: { id: serviceId },
    data: {
      rating: avgRating,
      updated_at: new Date(),
    },
  });

  return newReview;
};

const getReviewsByService = async (serviceId) => {
  const reviews = await prisma.review.findMany({
    where: { service_id: serviceId },
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
    where: { service_id: { in: serviceIds } },
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
