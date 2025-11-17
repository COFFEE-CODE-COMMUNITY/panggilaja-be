import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import uploadUserAsset from "./uploadFileService.js";
import { dokumentasiPhoto } from "../utils/filePath.js";

const addNewDocs = async (sellerId, file) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const sellerAvail = await tx.SellerProfile.findUnique({
        where: { id: sellerId },
      });

      if (!sellerAvail) throw new NotFoundError("Seller not found");

      const newDocument = await tx.Documentation.create({
        data: {
          seller_id: sellerId,
          foto_testimoni: "init.png",
        },
      });

      const fileName = `docs_${Date.now()}.jpg`;
      const filePath = dokumentasiPhoto(
        sellerAvail.user_id,
        sellerAvail.id,
        newDocument.id,
        fileName
      );

      const uploadResult = await uploadUserAsset(file, filePath);

      const updateDocs = await tx.Documentation.update({
        where: { id: newDocument.id },
        data: { foto_testimoni: uploadResult.url },
      });

      return updateDocs;
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getAllDocs = async (sellerId) => {
  try {
    const docs = await prisma.Documentation.findMany({
      where: { seller_id: sellerId },
    });

    return docs;
  } catch (error) {
    console.error(error);
    throw error;
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
  getAllDocs,
  updateDocsById,
  deleteDocsById,
};
