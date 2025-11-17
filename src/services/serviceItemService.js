import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { servicePhoto } from "../utils/filePath.js";
import uploadUserAsset from "./uploadFileService.js";

const getAllServices = async () => {
  try {
    const services = await prisma.service.findMany({
      include: {
        seller: {
          select: {
            nama_toko: true,
          },
        },
      },
    });

    // ubah hasil jadi lebih simpel (kalau mau)
    const response = services.map((service) => ({
      ...service,
      seller_name: service.seller.nama_toko,
    }));

    return response;
  } catch (err) {
    console.error("Error fetching service:", err.message);
    throw err;
  }
};

const getServiceById = async (id) => {
  try {
    const services = await prisma.service.findUnique({
      where: { id },
    });

    if (!services) throw new NotFoundError("Service not found");

    return services;
  } catch (err) {
    console.error("Error fetching service:", err.message);
    throw err;
  }
};

const addItemService = async (seller_id, data, file) => {
  try {
    const seller = await prisma.SellerProfile.findUnique({
      where: { id: seller_id },
    });

    if (!seller) throw new NotFoundError(404, "Seller not found");

    const newService = await prisma.service.create({
      data: {
        seller_id: seller_id,
        nama_jasa: data.nama_jasa,
        deskripsi: data.deskripsi,
        base_price: data.base_price,
        top_price: data.top_price,
        foto_product: "init.jpg",
        status: "active",
        kategori_id: data.kategori_id,
      },
    });

    const fileName = `service_${Date.now()}.jpg`;

    const filePath = servicePhoto(
      seller.user_id,
      seller_id,
      newService.id,
      fileName
    );

    const uploadResult = await uploadUserAsset(file, filePath);

    const updatedService = await prisma.service.update({
      where: { id: newService.id },
      data: { foto_product: uploadResult.url },
    });

    return updatedService;
  } catch (err) {
    console.error("Error add new service:", err.message);
    throw err;
  }
};

const updateServiceById = async (id, data) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) throw new NotFoundError(404, "Service not found");

    const updatedService = await prisma.service.update({
      where: { id },
      data,
    });

    return updatedService;
  } catch (err) {
    console.error("Error update service:", err.message);
    throw err;
  }
};

const deleteServiceById = async (id) => {
  try {
    const deletedService = await prisma.$transaction(async (tx) => {
      await tx.FavoriteService.deleteMany({ where: { service_id: id } });
      return await tx.service.delete({ where: { id } });
    });

    return deletedService;
  } catch (err) {
    console.error("Error deleting service:", err.message);
    throw err;
  }
};

const getAllKategori = async () => {
  try {
    const kategoriList = await prisma.kategori.findMany({
      orderBy: {
        kategori: "asc", // urutkan alfabetis biar rapi
      },
    });

    console.log(kategoriList);

    return kategoriList;
  } catch (error) {
    console.error("Error fetching kategori:", error);
    throw new Error("Gagal mengambil data kategori");
  }
};

export default {
  getAllServices,
  getServiceById,
  addItemService,
  updateServiceById,
  deleteServiceById,
  getAllKategori,
};
