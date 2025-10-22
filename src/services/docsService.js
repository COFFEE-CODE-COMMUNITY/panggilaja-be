import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const addNewDocs = async (id, data) => {
  try {
    const sellerAvail = await prisma.SellerProfile.findUnique({
      where: { id },
    });

    if (!sellerAvail) throw new NotFoundError("Seller not found");

    const newDocument = await prisma.Documentation.create({
      data: {
        // cara sementara
        service_id: "cdd44653-e3d1-4a9c-bb6a-396468e28cef",
        seller_id: id,
        foto_testimoni: data.foto_testimoni,
      },
    });

    return newDocument;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateDocsById = async (id, data) => {
  try {
    const document = await prisma.Documentation.findUnique({
      where: { id },
    });

    if (!document) throw new NotFoundError(404, "Document not found");

    const updatedDocument = await prisma.Documentation.update({
      where: { id },
      data,
    });

    return updatedDocument;
  } catch (err) {
    console.error("Error update document:", err.message);
    throw err;
  }
};

const deleteDocsById = async (id) => {
  try {
    const document = await prisma.Documentation.findUnique({
      where: { id },
    });

    if (!document) throw new NotFoundError(404, "Document not found");

    const deleteDocument = await prisma.Documentation.delete({ where: { id } });

    return deleteDocument;
  } catch (err) {
    console.error("Error delete service:", err.message);
    throw err;
  }
};

export default {
  addNewDocs,
  updateDocsById,
  deleteDocsById,
};
