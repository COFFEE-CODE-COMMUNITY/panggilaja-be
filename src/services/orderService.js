import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const getOrderById = async (id) => {
  try {
    const order = await prisma.Order.findUnique({ where: { id } });
    if (!order) throw new NotFoundError("Order not found");
    return order;
  } catch (err) {
    console.error("Error fetching order:", err.message);
    throw err;
  }
};

const addNewOrder = async (sellerId, serviceId, buyerId, totalHarga, data) => {
  try {
    const seller = await prisma.SellerProfile.findUnique({
      where: { id: sellerId },
    });
    const service = await prisma.Service.findUnique({
      where: { id: serviceId },
    });
    const buyer = await prisma.BuyerProfile.findUnique({
      where: { id: buyerId },
    });

    if (!seller || !service || !buyer)
      throw new NotFoundError(404, "Data not found");

    const newOrder = await prisma.Order.create({
      data: {
        seller_id: sellerId,
        pesan_tambahan: data.pesan_tambahan,
        total_harga: totalHarga,
        service_id: serviceId,
        buyer_id: buyerId,
      },
    });

    return newOrder;
  } catch (err) {
    console.error("Error add new order:", err.message);
    throw err;
  }
};

const updateOrderById = async (id, data) => {
  try {
    const order = await prisma.Order.findUnique({
      where: { id },
    });

    if (!order) throw new NotFoundError(404, "Order not found");

    const updatedOrder = await prisma.Order.update({
      where: { id },
      data,
    });

    return updatedOrder;
  } catch (err) {
    console.error("Error update order:", err.message);
    throw err;
  }
};

const deleteOrderById = async (id) => {
  try {
    const order = await prisma.Order.delete({ where: { id } });
    return order;
  } catch (err) {
    console.error("Error delete order:", err.message);
    throw err;
  }
};

export default {
  getOrderById,
  addNewOrder,
  updateOrderById,
  deleteOrderById,
};
