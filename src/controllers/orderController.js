import ForbiddenError from "../exceptions/ForbiddenError.js";
import orderService from "../services/orderService.js";

const getAllOrderBuyer = async (req, res, next) => {
  try {
    if (req.user.active_role === "seller") {
      throw new ForbiddenError("Only buyer");
    }
    const id = req.user.id_buyer;
    const result = await orderService.getAllOrderBuyer(id);
    res.status(200).json({
      status: "success",
      message: `Success Get Buyer Order: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await orderService.getOrderById(id);
    res.status(200).json({
      status: "success",
      message: `Success Get Order by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addNewOrder = async (req, res, next) => {
  try {
    const buyerId = req.user.id_buyer;
    const data = req.body;
    const result = await orderService.addNewOrder(buyerId, data);

    // Emit notification to seller
    const io = req.app.get("io");
    if (io && result?.seller_id) {
      const sellerRoom = `user_seller_${result.seller_id}`;
      io.to(sellerRoom).emit("new_incoming_order", {
        orderId: result.id,
        serviceName: result.service?.nama_jasa,
        message: `New order #${result.id} received!`,
        data: result
      });
      console.log(`🔔 New order notification emitted to ${sellerRoom}`);
    }

    res.status(201).json({
      status: "success",
      message: "Order added successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await orderService.updateOrderById(id, request);

    // Emit notification to buyer
    const io = req.app.get("io");
    if (io && result?.buyer_id) {
      const buyerRoom = `user_buyer_${result.buyer_id}`;
      io.to(buyerRoom).emit("order_status_updated", {
        orderId: result.id,
        status: result.status,
        message: `Order #${result.id} status updated to ${result.status}`,
      });
      console.log(`🔔 Order status updated emitted to ${buyerRoom}`);
    }

    res.status(200).json({
      status: "success",
      message: `Success Update Order by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await orderService.deleteOrderById(id);
    res.status(200).json({
      status: "success",
      message: `Success Delete Order by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllOrderBuyer,
  getOrderById,
  addNewOrder,
  updateOrderById,
  deleteOrderById,
};
