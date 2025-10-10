import prisma from "../database/prisma.js";

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (err) {
    console.error("Error fetching user:", err.message);
    throw err;
  }
};

const updateUserById = async (id, userData, addressData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error("User not found");

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
    console.error("Error fetching user:", err.message);
    throw err;
  }
};

const deleteUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error("User not found");

    const deleteAccount = prisma.user.delete({ where: { id } });

    return deleteAccount;
  } catch (err) {
    console.error("Error fetching user:", err.message);
    throw err;
  }
};

export default {
  getUserById,
  updateUserById,
  deleteUserById,
};
