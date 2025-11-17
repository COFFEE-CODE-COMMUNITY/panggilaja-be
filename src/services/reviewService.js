import prisma from "../database/prisma.js";
import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";

const createReview = async ({ buyerId, orderId, rating, komentar }) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");

    console.log(order);

    if (order.status !== "completed") {
      throw new ForbiddenError(
        "You can only review your completed orders",
        "ORDER_NOT_COMPLETED"
      );
    }

    const serviceId = order.service_id;

    const service = await tx.service.findUnique({
      where: { id: serviceId },
    });

    if (!service)
      throw new NotFoundError("Service not found", "SERVICE_NOT_FOUND");

    const existingReview = await tx.review.findFirst({
      where: {
        buyer_id: buyerId,
        service_id: serviceId,
      },
    });

    if (existingReview)
      throw new BadRequestError(
        "You have already reviewed this service",
        "REVIEW_DUPLICATE"
      );

    const newReview = await tx.review.create({
      data: {
        buyer_id: buyerId,
        service_id: serviceId,
        rating,
        komentar,
      },
    });

    const reviews = await tx.review.findMany({
      where: { service_id: serviceId },
      select: { rating: true },
    });

    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await tx.service.update({
      where: { id: serviceId },
      data: {
        rata_rata_rating: avgRating,
        updated_at: new Date(),
      },
    });

    return newReview;
  });
};

const getReviewsByService = async (serviceId) => {
  const reviews = await prisma.review.findMany({
    where: { service_id: serviceId },
    include: {
      buyer: {
        select: {
          fullname: true,
          foto_buyer: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return reviews;
};

const getReviewsByBuyer = async (buyerId) => {
  const reviews = await prisma.review.findMany({
    where: { buyer_id: buyerId },
    include: {
      service: {
        select: { nama_jasa: true, foto_product: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return reviews;
};

const getReviewsBySeller = async (sellerId) => {
  const services = await prisma.service.findMany({
    where: { seller_id: sellerId },
    select: { id: true, nama_jasa: true },
  });

  if (services.length === 0)
    throw new NotFoundError("Seller has no services", "SELLER_NO_SERVICES");

  const serviceIds = services.map((s) => s.id);

  // Ambil semua review dari semua jasa seller ini
  const reviews = await prisma.review.findMany({
    where: { service_id: { in: serviceIds } },
    include: {
      buyer: {
        select: {
          fullname: true,
          foto_buyer: true,
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
  getReviewsByBuyer,
  getReviewsBySeller,
};
