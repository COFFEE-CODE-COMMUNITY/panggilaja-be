import sellerService from "../services/sellerService.js";

const getAllSeller = async (req, res, next) => {
  try {
    const result = await sellerService.getAllSeller();
    res.status(200).json({
      status: "success",
      message: "Success Get All Data Seller!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSellerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await sellerService.getSellerById(id);
    res.status(200).json({
      status: "success",
      message: `Success Get Seller by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllServiceByIdSeller = async (req, res, next) => {
  try {
    const sellerId = req.params.sellerId;
    const result = await sellerService.getAllServiceByIdSeller(sellerId);
    res.status(200).json({
      status: "success",
      message: `Success Get All Service by Seller Id: ${sellerId}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addNewSeller = async (req, res, next) => {
  try {
    const request = req.body;
    if (!request.username || !request.email || !request.password) {
      throw new BadRequestError(
        "All fields are mandatory",
        "MISSING_CREDENTIAL"
      );
    }
    const newSeller = await sellerService.addNewSeller(request);
    res.status(200).json({
      status: "success",
      message: "Account created",
      data: { seller: { _id: newSeller.id, email: newSeller.email } },
    });
  } catch (error) {
    next(error);
  }
};

const updateSellerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await sellerService.updateSellerById(id, request);
    res.status(200).json({
      status: "success",
      message: `Success Update Seller by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSellerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await sellerService.deleteSellerById(id);
    res.status(200).json({
      status: "success",
      message: `Success Delete Data Seller By Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllSeller,
  getSellerById,
  getAllServiceByIdSeller,
  addNewSeller,
  updateSellerById,
  deleteSellerById,
};
