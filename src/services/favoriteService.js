import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const deleteFavoriteById = async (id) => {
  try {
    const user = await prisma.FavoriteService.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("User not found");

    const deleteAccount = prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        login_provider: true,
        created_at: true,
        updated_at: true,
      },
    });

    return deleteAccount;
  } catch (err) {
    console.error("Error delete user:", err.message);
    throw err;
  }
};

export default {
  deleteFavoriteById,
};
