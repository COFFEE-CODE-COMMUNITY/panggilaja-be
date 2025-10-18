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
    const services = await prisma.service.findUnique({ where: { id } });
    if (!services) throw new NotFoundError("Service not found");
    return services;
  } catch (err) {
    console.error("Error fetching service:", err.message);
    throw err;
  }
};

const addItemService = async (seller_id, data) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id: seller_id },
    });

    if (!seller) throw new NotFoundError(404, "Seller not found");

    const newService = await prisma.service.create({
      data: {
        seller_id: seller_id,
        status: "Aktif",
        nama_jasa: data.nama_jasa,
        deskripsi: data.deskripsi,
        base_price: data.base_price,
        top_price: data.top_price,
        foto_product: data.foto_product,
        kategori_id: "09ae91a2-2b31-4ee4-bc89-189db4b65f3c",
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
