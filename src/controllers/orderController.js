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
