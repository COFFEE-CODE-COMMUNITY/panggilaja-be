import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import BadRequestError from "../exceptions/BadRequestError.js";

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

    return seller;
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

    // if (services.length === 0)
    //   throw new NotFoundError(`No services found for seller ID: ${sellerId}`);

    return services;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

const addNewSeller = async (user_id, dataSeller, dataSkill) => {
  try {
    const sellerAvail = await prisma.SellerProfile.findUnique({
      where: { user_id },
    });

    if (sellerAvail) {
      throw new BadRequestError("Account has already!", "AUTH_SELLER_TAKEN");
    }

    const newSeller = await prisma.$transaction(async (tx) => {
      const seller = await tx.SellerProfile.create({
        data: {
          user_id,
          status: "active",
          ...dataSeller,
        },
      });

      await tx.Skill.create({
        data: {
          seller_id: seller.id,
          ...dataSkill,
        },
      });

      await tx.UserRoleMap.create({
        data: {
          user_id,
          role: "SELLER",
        },
      });

      return seller;
    });

    return newSeller;
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
    const sellerAvail = await prisma.SellerProfile.findUnique({
      where: { id },
    });

    if (!sellerAvail) {
      throw new NotFoundError("Seller not found!");
    }

    await prisma.UserRoleMap.delete({
      where: {
        user_id_role: {
          user_id: sellerAvail.user_id,
          role: "SELLER",
        },
      },
    });

    const deletedSeller = await prisma.SellerProfile.delete({ where: { id } });

    return deletedSeller;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

// Additional
const getOrdersBySeller = async (id) => {
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

export default {
  getAllSeller,
  getSellerById,
  getAllServiceByIdSeller,
  addNewSeller,
  updateSellerById,
  deleteSellerById,
  getOrdersBySeller,
};
