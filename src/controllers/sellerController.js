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

const updateSellerById = async (id, dataSeller, dataSkill) => {
  try {
    const seller = await prisma.SellerProfile.findUnique({
      where: { id },
    });

    if (!seller) throw new NotFoundError(404, "Seller not found");

    const updatedSeller = await prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.SellerProfile.update({
        where: { id },
        data: {
          ...dataSeller,
        },
      });

      await tx.Skill.update({
        where: { id },
        data: {
          ...dataSkill,
        },
      });

      return updatedProfile;
    });

    return updatedSeller;
  } catch (err) {
    console.error("Error update service:", err.message);
    throw err;
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
