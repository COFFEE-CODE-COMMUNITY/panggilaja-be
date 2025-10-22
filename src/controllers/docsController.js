import documentService from "../services/docsService.js";

const addNewDocs = async (req, res, next) => {
  try {
    const id = req.user.id_seller;
    const data = req.body;
    const addNewDocs = await documentService.addNewDocs(id, data);
    res.status(200).json({
      status: "success",
      message: "Documentation added",
      data: addNewDocs,
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
  updateDocsById,
  deleteDocsById,
};
