import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("User not found");

    return user;
  } catch (err) {
    console.error("Error fetching user:", err.message);
    throw err;
  }
};

const getAddressById = async (id) => {
  try {
    const address = await prisma.alamatUser.findUnique({
      where: { user_id: id },
    });

    if (!address) throw new NotFoundError("Address not found");

    return address;
  } catch (err) {
    console.error("Error fetching address user:", err.message);
    throw err;
  }
};

const updateUserById = async (id, userData, addressData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("User not found");

    const [updateUserData, updateAddressData] = await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { ...userData },
      }),
      prisma.alamatUser.upsert({
        where: { user_id: id },
        update: addressData,
        create: {
          user_id: id,
          ...addressData,
        },
      }),
    ]);

    return { ...updateUserData, alamat: updateAddressData };
  } catch (err) {
    console.error("Error update user:", err.message);
    throw err;
  }
};

const deleteUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("User not found");

    const deleteAccount = prisma.user.delete({ where: { id } });

    return deleteAccount;
  } catch (err) {
    console.error("Error delete user:", err.message);
    throw err;
  }
};

export default {
  getUserById,
  getAddressById,
  updateUserById,
  deleteUserById,
};
