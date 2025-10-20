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
    const user_id = req.user.id;
    const dataSeller = {
      deskripsi_toko: req.body.deskripsi_toko,
      foto_toko: req.body.foto_toko,
      kategori_toko: req.body.kategori_toko,
      pengalaman: req.body.pengalaman,
    };
    const dataSkill = {
      skill: req.body.skill,
    };
    const addNewSeller = await sellerService.addNewSeller(
      user_id,
      dataSeller,
      dataSkill
    );
    res.status(200).json({
      status: "success",
      message: "Account created",
      data: addNewSeller,
    });
  } catch (error) {
    next(error);
  }
};

const updateSellerById = async (req, res, next) => {
  try {
    // const sellerId = req.user.id;
    const sellerId = "3ab63dcc-6229-49f8-b4af-ce6da7e0d37e";
    const dataSeller = {
      deskripsi_toko: req.body.deskripsi_toko,
      foto_toko: req.body.foto_toko,
      kategori_toko: req.body.kategori_toko,
      pengalaman: req.body.pengalaman,
    };
    const dataSkill = {
      skill: req.body.skill,
    };
    const UpdateSeller = await sellerService.updateSellerById(
      sellerId,
      dataSeller,
      dataSkill
    );
    res.status(200).json({
      status: "success",
      message: "Account created",
      data: UpdateSeller,
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
