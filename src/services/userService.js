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
    const address = await prisma.BuyerProfile.findUnique({
      where: { user_id: id },
    });

    if (!address) throw new NotFoundError("Address not found");

    return address;
  } catch (err) {
    console.error("Error fetching address user:", err.message);
    throw err;
  }
};

const updateUserById = async (id, data) => {
  try {
    const buyerProfile = await prisma.BuyerProfile.findUnique({
      where: { user_id: id },
    });

    if (!buyerProfile) throw new NotFoundError("User not found");

    const updatedUserProfile = await prisma.BuyerProfile.update({
      where: { user_id: id },
      data,
    });

    return updatedUserProfile;
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

// Additional
const getOrdersByUserId = async (id) => {
  try {
    const orders = await prisma.Order.findMany({
      where: { buyer_id: id },
    });

    if (!orders) throw new NotFoundError("Orders not found");

    return orders;
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    throw err;
  }
};

// Searching
const getServicesByPlace = async (id, data) => {
  try {
    // Validasi user yang melakukan request
    const user = await prisma.User.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("User not found");

    // Cari semua user yang berada di kecamatan yang sama
    const buyers = await prisma.BuyerProfile.findMany({
      where: { kecamatan: data.kecamatan },
      select: { user_id: true },
    });

    if (buyers.length === 0) {
      throw new NotFoundError("No users found in this area");
    }

    // Ambil semua user_id dari buyer di lokasi itu
    const userIds = buyers.map((b) => b.user_id);

    // Ambil semua seller yang user_id-nya ada di daftar tersebut
    const sellers = await prisma.SellerProfile.findMany({
      where: { user_id: { in: userIds } },
      select: { id: true },
    });

    if (sellers.length === 0) {
      throw new NotFoundError("No sellers found in this area");
    }

    // Ambil semua service milik seller tersebut
    const sellerIds = sellers.map((s) => s.id);
    const services = await prisma.Service.findMany({
      where: { seller_id: { in: sellerIds } },
    });

    return services;
  } catch (err) {
    console.error("Error fetching services:", err.message);
    throw err;
  }
};

export default {
  getUserById,
  getAddressById,
  updateUserById,
  deleteUserById,
  getOrdersByUserId,
  getServicesByPlace,
};
