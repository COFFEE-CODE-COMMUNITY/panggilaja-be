import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const getAllOrderBuyer = async (buyer_id) => {
  try {
    const order = await prisma.Order.findMany({ where: { buyer_id } });
    if (!order) throw new NotFoundError("Order not found");
    return order;
  } catch (error) {
    console.error("Error fetching order:", err.message);
    throw err;
  }
};

const getOrderById = async (id) => {
  try {
    const order = await prisma.Order.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            user_id: true,
            fullname: true,
            foto_buyer: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        seller: {
          select: {
            id: true,
            user_id: true,
            nama_toko: true,
            foto_toko: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        service: {
          include: {
            kategori: true,
          },
        },
      },
    });

    console.log(order);

    if (!order) {
      throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
    }

    return order;
  } catch (err) {
    console.error("Error fetching order by ID:", err.message);
    throw err;
  }
};

const addNewOrder = async (buyerId, data) => {
  try {
    if (!data.id_service) {
      throw new Error("Service ID is required");
    }

    const service = await prisma.Service.findUnique({
      where: { id: data.id_service },
      select: {
        id: true,
        seller_id: true,
        base_price: true,
        top_price: true,
        nama_jasa: true,
      },
    });

    if (!service) {
      throw new NotFoundError(404, "Service not found");
    }

    let total_harga = service.base_price;

    if (data.pesan_tambahan) {
      const priceMatch = data.pesan_tambahan.match(/Rp\s*([\d.,]+)/);
      if (priceMatch) {
        const parsedPrice = parseFloat(
          priceMatch[1].replace(/\./g, "").replace(",", ".")
        );
        if (parsedPrice > 0) {
          total_harga = parsedPrice;
        }
      }
    }

    if (
      total_harga < service.base_price * 0.3 ||
      total_harga > service.top_price * 2
    ) {
      throw new Error("Harga tidak valid");
    }

    const newOrder = await prisma.Order.create({
      data: {
        seller_id: service.seller_id,
        buyer_id: buyerId,
        service_id: service.id,
        pesan_tambahan: data.pesan_tambahan || "",
        total_harga: total_harga,
        status: "in_progress",
      },
      include: {
        service: {
          select: {
            nama_jasa: true,
            foto_product: true,
          },
        },
        seller: {
          select: {
            nama_toko: true,
          },
        },
      },
    });

    console.log(newOrder);

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
  getAllOrderBuyer,
  getOrderById,
  addNewOrder,
  updateOrderById,
  deleteOrderById,
};
