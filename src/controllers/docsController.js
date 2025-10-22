import serviceItemService from "../services/docsService.js";

const updateDocsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const result = await serviceItemService.updateDocsById(id, request);
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
    const result = await serviceItemService.deleteDocsById(id);
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
  updateDocsById,
  deleteDocsById,
};
