import serviceItemService from "../services/serviceItemService.js";

const getAllServices = async (req, res, next) => {
  try {
    console.log("Masuk sini");
    const result = await serviceItemService.getAllServices();
    res.status(200).json({
      status: "success",
      message: "Success Get All Data Service!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await serviceItemService.getServiceById(id);
    res.status(200).json({
      status: "success",
      message: `Success Get Service by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addItemService = async (req, res, next) => {
  try {
    console.log(req.user);
    const seller_id = req.user.id_seller;
    const file = req.file;
    const jsonData = JSON.parse(req.body.data);
    const result = await serviceItemService.addItemService(
      seller_id,
      jsonData,
      file
    );
    res.status(201).json({
      status: "success",
      message: "Service added successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateServiceById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await serviceItemService.updateServiceById(id, request);
    res.status(200).json({
      status: "success",
      message: `Success Get Service by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteServiceById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await serviceItemService.deleteServiceById(id);
    res.status(200).json({
      status: "success",
      message: `Success Delete Service by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKategori = async (req, res, next) => {
  try {
    console.log("Masuk controller kategori");
    const data = await serviceItemService.getAllKategori();
    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil semua kategori",
      data,
    });
  } catch (error) {
    console.log("Error bang");
    next(error);
  }
};

export default {
  getAllServices,
  getServiceById,
  addItemService,
  updateServiceById,
  deleteServiceById,
  getAllKategori,
};
