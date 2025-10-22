import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const getAllServices = async () => {
  try {
    const services = await prisma.service.findMany();
    return services;
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

const addItemService = async (seller_id, data) => {
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
        foto_product: data.foto_product,
        status: "active",
        kategori_id: "6387fa09-a02a-4fe4-bb5c-19690f2bd937",
      },
    });

    return newService;
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
    const services = await prisma.service.delete({ where: { id } });
    return services;
  } catch (err) {
    console.error("Error delete service:", err.message);
    throw err;
  }
};

export default {
  getAllServices,
  getServiceById,
  addItemService,
  updateServiceById,
  deleteServiceById,
};
