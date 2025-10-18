import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import bcrypt from "bcrypt";
import BadRequestError from "../exceptions/BadRequestError.js";

const getAllSeller = async () => {
  try {
    const sellers = prisma.seller.findMany();
    return sellers;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

const getSellerById = async (id) => {
  try {
    const seller = prisma.seller.findUnique({ where: { id } });
    if (!seller) throw new NotFoundError("Seller not found");
    return seller;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

const getAllServiceByIdSeller = async (sellerId) => {
  try {
    const services = prisma.service.findMany({
      where: { seller_id: sellerId },
    });
    if (!services)
      throw new NotFoundError(`Service by seller id: ${sellerId} not found`);
    return services;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
    throw err;
  }
};

const addNewSeller = async (data) => {
  try {
    const sellerAvail = await prisma.seller.findUnique({
      where: { email: data.email },
    });

    if (sellerAvail) {
      throw new BadRequestError("Email already registered", "AUTH_EMAIL_TAKEN");
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const newSeller = await prisma.seller.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashPassword,
        status: "active",
      },
    });

    return newSeller;
  } catch (err) {
    console.error("Error creating seller:", err.message);
    throw err;
  }
};

const updateSellerById = async (id, data) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id },
    });

    if (!seller) throw new NotFoundError(404, "Seller not found");

    const updatedSeller = await prisma.seller.update({
      where: { id },
      data,
    });

    return updatedSeller;
  } catch (err) {
    console.error("Error update service:", err.message);
    throw err;
  }
};

const deleteSellerById = async (id) => {
  try {
    const seller = prisma.seller.delete({ where: { id } });
    if (!seller) throw new NotFoundError("Seller not found");
    return seller;
  } catch (err) {
    console.error("Errorfetching seller:", err.message);
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
};
