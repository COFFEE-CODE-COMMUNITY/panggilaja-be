import favoriteService from "../services/favoriteService.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

const deletefavoriteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const loggedInfavoriteId = req.favorite.id;

    // validasi id pada token dan parameter
    if (id !== loggedInfavoriteId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

    const result = await favoriteService.deletefavoriteById(id);
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
