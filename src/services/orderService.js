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

const addNewOrder = async (buyerId, data) => {
  try {
    // cara sementara
    const id_service = "c69e74c2-448b-40ff-9787-b4a1adb18223";
    const service = await prisma.Service.findUnique({
      where: { id: id_service },
      select: {
        id: true,
        seller_id: true,
      },
    });
    const total_harga = 500000;

    if (!service) throw new NotFoundError(404, "Service not found");

    const newOrder = await prisma.Order.create({
      data: {
        seller_id: service.seller_id,
        pesan_tambahan: data.pesan_tambahan,
        total_harga: total_harga,
        service_id: service.id,
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
