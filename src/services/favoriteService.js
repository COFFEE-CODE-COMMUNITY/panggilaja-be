import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const deleteFavoriteById = async (id) => {
  try {
    const favorite = await prisma.FavoriteService.findUnique({
      where: { id },
    });

    if (!favorite) throw new NotFoundError("Favorite not found");

    const deleteFavorite = prisma.FavoriteService.delete({
      where: { id },
    });

    return deleteFavorite;
  } catch (err) {
    console.error("Error delete favorite:", err.message);
    throw err;
  }
};

export default {
  deleteFavoriteById,
};
