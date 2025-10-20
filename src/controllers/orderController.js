import orderService from "../services/orderService.js";

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
    // const seller_id = req.user.id;
    const sellerId = "910ca18c-575a-4a20-8f3e-b0f6dbb9b333";
    const serviceId = "bdfc100b-7670-4512-9d09-c4be23f83c7b";
    const buyerId = "91a57097-3112-4be4-9f9d-bb1220369d0f";
    const totalHarga = 5000000;
    const data = req.body;
    const result = await orderService.addNewOrder(
      sellerId,
      serviceId,
      buyerId,
      totalHarga,
      data
    );
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
  getOrderById,
  addNewOrder,
  updateOrderById,
  deleteOrderById,
};
