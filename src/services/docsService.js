import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import uploadUserAsset from "./uploadFileService.js";
import { dokumentasiPhoto } from "../utils/filePath.js";

const addNewDocs = async (id, file) => {
  try {
    const sellerAvail = await prisma.SellerProfile.findUnique({
      where: { id },
    });

    if (!sellerAvail) throw new NotFoundError("Seller not found");

    const newDocument = await prisma.Documentation.create({
      data: {
        // cara sementara
        service_id: "bdc206df-0f97-4a60-8e40-a3a8fc98a94c",
        seller_id: id,
        foto_testimoni: "init.png",
      },
    });

    const fileName = `docs_${Date.now()}.jpg`;
    const filePath = dokumentasiPhoto(
      sellerAvail.user_id,
      id,
      newDocument.id,
      fileName
    );

    const uploadResult = uploadUserAsset(file, filePath);

    const updateDocs = await prisma.Documentation.update({
      where: { id: newDocument.id },
      data: { foto_testimoni: (await uploadResult).url },
    });

    return updateDocs;
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
