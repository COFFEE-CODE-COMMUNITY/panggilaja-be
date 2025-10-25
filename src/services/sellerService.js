import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import BadRequestError from "../exceptions/BadRequestError.js";
import { profileSeller } from "../utils/filePath.js";
import uploadUserAsset from "./uploadFileService.js";

const getAllSeller = async () => {
  try {
    const sellers = await prisma.SellerProfile.findMany();

    if (!sellers) throw new NotFoundError("No sellers are listed");

    return sellers;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

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

const getAllServiceByIdSeller = async (sellerId) => {
  try {
    const seller = await prisma.SellerProfile.findUnique({
      where: { id: sellerId },
    });

    if (!seller) throw new NotFoundError("Seller not found");

    const services = await prisma.service.findMany({
      where: { seller_id: sellerId },
    });

    return services;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

const addNewSeller = async (
  user_id,
  dataSeller,
  dataSkill,
  dataAddressSeller,
  file
) => {
  try {
    const sellerAvail = await prisma.SellerProfile.findUnique({
      where: { user_id },
    });

    if (sellerAvail) {
      throw new BadRequestError("Account has already!", "AUTH_SELLER_TAKEN");
    }

    const buyer = await prisma.BuyerProfile.findUnique({
      where: { user_id },
    });

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const namaToko = `${buyer.fullname}${randomSuffix}`;

    const newSeller = await prisma.$transaction(async (tx) => {
      const seller = await tx.SellerProfile.create({
        data: {
          user_id,
          status: "active",
          nama_toko: namaToko,
          ...dataSeller,
        },
      });

      await tx.Skill.create({
        data: {
          seller_id: seller.id,
          ...dataSkill,
        },
      });

      await tx.AlamatSeller.create({
        data: {
          id_seller: seller.id,
          alamat: dataAddressSeller.alamat,
          provinsi: dataAddressSeller.provinsi,
          kota: dataAddressSeller.kota,
          kecamatan: dataAddressSeller.kecamatan,
          kode_pos: dataAddressSeller.kode_pos,
        },
      });

      const existingRole = await tx.UserRoleMap.findFirst({
        where: { user_id, role: "SELLER" },
      });

      if (!existingRole) {
        await tx.UserRoleMap.create({
          data: {
            user_id,
            role: "SELLER",
          },
        });
      }

      return seller;
    });

    const fileName = `profile_${Date.now()}.jpg`;
    const filePath = profileSeller(user_id, newSeller.id, fileName);
    const uploadResult = await uploadUserAsset(file, filePath);

    const updateProfile = await prisma.SellerProfile.update({
      where: { id: newSeller.id },
      data: {
        foto_toko: uploadResult.url,
      },
    });

    return updateProfile;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateSellerById = async (id, dataSeller, dataSkill) => {
  try {
    const seller = await prisma.SellerProfile.findUnique({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundError(404, "Seller not found");
    }

    const updatedSeller = await prisma.$transaction(async (tx) => {
      const updatedSeller = await tx.SellerProfile.update({
        where: { id },
        data: {
          status: "active",
          ...dataSeller,
        },
      });

      await tx.Skill.updateMany({
        where: { seller_id: id },
        data: { ...dataSkill },
      });

      return updatedSeller;
    });

    return updatedSeller;
  } catch (err) {
    console.error("Error updating seller:", err.message);
    throw err;
  }
};

const deleteSellerById = async (id) => {
  try {
    const seller = await prisma.SellerProfile.findUnique({ where: { id } });
    if (!seller) {
      throw new NotFoundError("Seller not found!");
    }

    const deletedSeller = await prisma.$transaction(async (tx) => {
      await tx.UserRoleMap.delete({
        where: {
          user_id_role: {
            user_id: seller.user_id,
            role: "SELLER",
          },
        },
      });

      await tx.AlamatSeller.delete({
        where: { id_seller: id },
      });

      await prisma.Skill.delete({
        where: {
          seller_id: id,
        },
      });

      return await tx.SellerProfile.delete({
        where: { id },
      });
    });

    return deletedSeller;
  } catch (error) {
    console.error("❌ Error deleting seller:", error.message);
    throw error;
  }
};

// Additional
const getOrdersBySellerId = async (id) => {
  try {
    const orders = await prisma.Order.findMany({
      where: { seller_id: id },
    });

    if (!orders) throw new NotFoundError("Order not found");

    return orders;
  } catch (err) {
    console.error("Errorfetching order:", err.message);
    throw err;
  }
};

// Documentation
const getDocsById = async (id) => {
  try {
    const docs = await prisma.Documentation.findMany({
      where: { seller_id: id },
    });

    return docs;
  } catch (err) {
    console.error("Errorfetching docs:", err.message);
    throw err;
  }
};

export default {
  getAllSeller,
  getSellerById,
  getAllServiceByIdSeller,
  addNewSeller,
  updateSellerById,
  deleteSellerById,
  getOrdersBySellerId,
  getDocsById,
};
