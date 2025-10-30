import favoriteService from "../services/favoriteService.js";

const deletefavoriteById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await favoriteService.deleteFavoriteById(id);
    res.status(200).json({
      status: "success",
      message: `Success Delete Current favorite by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  deletefavoriteById,
};
