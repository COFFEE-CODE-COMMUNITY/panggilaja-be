import ForbiddenError from "../exceptions/ForbiddenError.js";
import documentService from "../services/docsService.js";

const addNewDocs = async (req, res, next) => {
  try {
    const sellerId = req.user?.id_seller;
    const file = req.file;

    if (!sellerId) throw new ForbiddenError("GA PUNYA AKSES BANG");

    if (!file) {
      return res.status(400).json({
        status: "fail",
        message: "Butuh file bang",
      });
    }
    const addNewDocs = await documentService.addNewDocs(sellerId, file);

    res.status(200).json({
      status: "success",
      message: "Documentation added",
      data: addNewDocs,
    });
  } catch (error) {
    if (error.name === "MulterError") {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "fail",
          message: "File terlalu besar! Maksimal 1MB.",
        });
      }

      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    if (error.message === "Only images are allowed") {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    next(error);
  }
};

const getSellerDocs = async (req, res, next) => {
  try {
    const sellerId = req.user?.id_seller;

    if (!sellerId) throw new ForbiddenError("GA PUNYA AKSES BANG");

    const allDocs = await documentService.getAllDocs(sellerId);

    res.status(200).json({
      status: "success",
      message: "Getting All Documentation",
      data: allDocs,
    });
  } catch (error) {
    next(error);
  }
};

const updateDocsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await documentService.updateDocsById(id, request);
    res.status(200).json({
      status: "success",
      message: `Success Update Documentation by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await documentService.deleteDocsById(id);
    res.status(200).json({
      status: "success",
      message: `Success Delete Documentation by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addNewDocs,
  getSellerDocs,
  updateDocsById,
  deleteDocsById,
};
