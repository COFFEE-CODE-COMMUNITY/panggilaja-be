import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { profileBuyer } from "../utils/filePath.js";
import uploadUserAsset from "./uploadFileService.js";

const getUserById = async (id) => {
  try {
    const user = await prisma.BuyerProfile.findUnique({
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
    const address = await prisma.AlamatBuyer.findFirst({
      where: { id_buyer: id },
    });

    return address;
  } catch (err) {
    console.error("Error fetching address user:", err.message);
    throw err;
  }
};

const addNewAddress = async (id, data) => {
  try {
    const buyerProfile = await prisma.BuyerProfile.findUnique({
      where: { id },
    });

    if (!buyerProfile) throw new NotFoundError("Buyer not found");

    const existingAddress = await prisma.AlamatBuyer.findFirst({
      where: { id_buyer: id },
    });

    let address;
    if (existingAddress) {
      address = await prisma.AlamatBuyer.update({
        where: { id: existingAddress.id },
        data: {
          alamat: data.alamat,
          provinsi: data.provinsi,
          kota: data.kota,
          kecamatan: data.kecamatan,
          kode_pos: data.kode_pos,
        },
      });
    } else {
      address = await prisma.AlamatBuyer.create({
        data: {
          id_buyer: id,
          alamat: data.alamat,
          provinsi: data.provinsi,
          kota: data.kota,
          kecamatan: data.kecamatan,
          kode_pos: data.kode_pos,
        },
      });
    }

    return address;
  } catch (err) {
    throw err;
  }
};

const deleteAddressById = async (id) => {
  try {
    const addressId = await prisma.AlamatBuyer.findUnique({
      where: { id },
    });

    if (!addressId) throw new NotFoundError("Address not found");

    const deleteAddress = await prisma.AlamatBuyer.delete({
      where: { id },
    });

    return deleteAddress;
  } catch (err) {
    console.error("❌ Error deleting address:", err.message);
    throw err;
  }
};

const updateUserById = async (id, data, file) => {
  try {
    const addressId = await prisma.AlamatBuyer.findUnique({
      where: { id },
    });

    if (!addressId) throw new NotFoundError("Address not found");

    const fileName = `profile_${Date.now()}.jpg`;

    const filePath = profileBuyer(id, addressId.id_buyer, fileName, fileName);

    const uploadResult = await uploadUserAsset(file, filePath);

    const result = await prisma.$transaction([
      prisma.BuyerProfile.update({
        where: { id: addressId.id_buyer },
        data: {
          fullname: data.fullname,
          foto_buyer: uploadResult.url,
        },
      }),
      prisma.AlamatBuyer.update({
        where: { id },
        data: {
          alamat: data.alamat,
          provinsi: data.provinsi,
          kota: data.kota,
          kecamatan: data.kecamatan,
          kode_pos: data.kode_pos,
        },
      }),
    ]);

    console.log(result);
    return result;
  } catch (err) {
    console.error("Error update address:", err.message);
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

        await tx.AlamatBuyer.deleteMany({
          where: { id_buyer: buyer.id },
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
      where: { id },
      select: { id: true },
    });

    if (!buyerId) throw new NotFoundError("Buyer not found");

    const orders = await prisma.Order.findMany({
      where: { buyer_id: id },
    });

    // if (orders.length === 0) throw new NotFoundError("No orders found");

    return orders;
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    throw err;
  }
};

// Searching
const getServicesByPlace = async (kecamatan) => {
  try {
    if (!kecamatan) {
      throw new BadRequestError("Kecamatan parameter is required");
    }

    const sellers = await prisma.alamatSeller.findMany({
      where: {
        kecamatan: {
          equals: kecamatan,
          mode: "insensitive",
        },
      },
      select: { id_seller: true },
    });

    const sellerIds = sellers.map((seller) => seller.id_seller);

    if (sellerIds.length === 0) return [];

    const services = await prisma.service.findMany({
      where: { seller_id: { in: sellerIds } },
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
        seller_id: true,
        kategori_id: true,
      },
    });

    return services;
  } catch (err) {
    console.error("Error fetching services by place:", err.message);
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

// userService.js - Perbaikan untuk addNewFavoriteService

const addNewFavoriteService = async (id, serviceId) => {
  try {
    if (!serviceId) throw new NotFoundError("Service not found"); // 1. Periksa apakah favorit sudah ada
    const existingFavorite = await prisma.FavoriteService.findUnique({
      where: {
        user_id_service_id: {
          // ASUMSI Anda memiliki unique index pada {user_id, service_id}
          user_id: id,
          service_id: serviceId,
        },
      },
    });

    if (existingFavorite) {
      // 💡 Jika sudah ada, kembalikan data yang ada saja (sukses tanpa create)
      return { message: "Service already favorited", data: existingFavorite };
    } // 2. Jika belum ada, baru create

    const addFavorite = await prisma.FavoriteService.create({
      data: {
        user_id: id,
        service_id: serviceId,
      },
    });

    return { message: "Service added to favorites", data: addFavorite };
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

    const addressSeller = await prisma.AlamatSeller.findUnique({
      where: { id_seller: id },
    });

    return { ...seller, address: { ...addressSeller } };
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

export default {
  getUserById,
  getAddressById,
  addNewAddress,
  deleteAddressById,
  updateUserById,
  deleteUserById,
  getOrdersByUserId,
  getServicesByPlace,
  getFavoriteServices,
  addNewFavoriteService,
  getSellerById,
};
