import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
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

    const buyer = await prisma.buyerProfile.findUnique({
      where: { user_id: id },
    });

    const seller = await prisma.sellerProfile.findUnique({
      where: { user_id: id },
    });

    const deletedAccount = await prisma.$transaction(async (tx) => {
      // Jika user adalah buyer → hapus semua data yang berelasi dengan buyer
      if (buyer) {
        await tx.order.deleteMany({
          where: { buyer_id: buyer.id },
        });

        await tx.buyerProfile.delete({
          where: { user_id: id },
        });
      }

      // Jika user adalah seller → hapus semua data yang berelasi dengan seller
      if (seller) {
        await tx.order.deleteMany({
          where: { seller_id: seller.id },
        });

        await tx.service.deleteMany({
          where: { seller_id: seller.id },
        });

        await tx.skill.deleteMany({
          where: { seller_id: seller.id },
        });

        await tx.sellerProfile.delete({
          where: { user_id: id },
        });
      }

      // Hapus mapping role jika ada
      await tx.userRoleMap.deleteMany({
        where: { user_id: id },
      });

      // Terakhir, hapus akun user utama
      const account = await tx.user.delete({
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

      return account;
    });

    return deletedAccount;
  } catch (err) {
    console.error("❌ Error deleting user:", err.message);
    throw err;
  }
};

// Additional
const getOrdersByUserId = async (id) => {
  try {
    const buyerId = await prisma.BuyerProfile.findUnique({
      where: { user_id: id },
      select: { id: true },
    });

    if (!buyerId) throw new NotFoundError("Buyer not found");

    const orders = await prisma.Order.findMany({
      where: { buyer_id: buyerId.id },
    });

    // if (orders.length === 0) throw new NotFoundError("No orders found");

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
      throw new NotFoundError("No service found in this area");
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
      where: {
        seller_id: { in: sellerIds },
      },
      select: {
        id: true,
        nama_jasa: true,
        deskripsi: true,
        base_price: true,
        top_price: true,
        foto_product: true,
        rata_rata_rating: true,
        jumlah_rating: true,
        jumlah_pembeli: true,
      },
    });

    return services;
  } catch (err) {
    console.error("Error fetching services:", err.message);
    throw err;
  }
};

// Favorite
const getFavoriteServices = async (id) => {
  try {
    const FavoriteService = await prisma.FavoriteService.findMany({
      where: { user_id: id },
    });

    // if (!FavoriteService) throw new NotFoundError("Favorite service not found");

    return FavoriteService;
  } catch (err) {
    console.error("Error fetching address user:", err.message);
    throw err;
  }
};

const addNewFavoriteService = async (id) => {
  try {
    // cara sementara
    const serviceId = "cdd44653-e3d1-4a9c-bb6a-396468e28cef";

    if (!serviceId) throw new NotFoundError("Service not found");

    const addFavorite = await prisma.FavoriteService.create({
      data: {
        user_id: id,
        service_id: serviceId,
      },
    });

    return addFavorite;
  } catch (err) {
    console.error("Error add favorite:", err.message);
    throw err;
  }
};

// Seller
const getSellerById = async (id) => {
  try {
    const seller = await prisma.SellerProfile.findUnique({
      where: { id },
    });

    if (!seller) throw new NotFoundError("Seller not found");

    return seller;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
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
  getFavoriteServices,
  addNewFavoriteService,
  getSellerById,
};
