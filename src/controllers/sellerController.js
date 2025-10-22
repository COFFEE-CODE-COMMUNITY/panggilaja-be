import sellerService from "../services/sellerService.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

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
    const loggedInSellerId = req.user.id_seller;

    // validasi id pada token dan parameter
    if (id !== loggedInSellerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

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
    const id = req.params.id;
    const loggedInSellerId = req.user.id_seller;

    // validasi id pada token dan parameter
    if (id !== loggedInSellerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

    const result = await sellerService.getAllServiceByIdSeller(id);
    res.status(200).json({
      status: "success",
      message: `Success Get All Service by Seller Id: ${id}`,
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
    const id = req.params.id;
    const loggedInSellerId = req.user.id_seller;

    // validasi id pada token dan parameter
    if (id !== loggedInSellerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

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
      id,
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
    const loggedInSellerId = req.user.id_seller;

    // validasi id pada token dan parameter
    if (id !== loggedInSellerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

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

// Additional
const getOrdersBySellerId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const loggedInSellerId = req.user.id_seller;

    // validasi id pada token dan parameter
    if (id !== loggedInSellerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

    const result = await sellerService.getOrdersBySellerId(id);
    res.status(200).json({
      status: "success",
      message: `Success Get Orders by Seller Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Documentation
const getDocsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const loggedInSellerId = req.user.id_seller;

    // validasi id pada token dan parameter
    if (id !== loggedInSellerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

    console.log(id);
    const result = await sellerService.getDocsById(id);

    res.status(200).json({
      status: "success",
      message: `Success Get Docs by Seller Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addNewDocs = async (req, res, next) => {
  try {
    const id = req.user.id_seller;
    const data = req.body;
    const addNewDocs = await sellerService.addNewDocs(id, data);
    res.status(200).json({
      status: "success",
      message: "Documentation added",
      data: addNewDocs,
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
  getOrdersBySellerId,
  getDocsById,
  addNewDocs,
};
