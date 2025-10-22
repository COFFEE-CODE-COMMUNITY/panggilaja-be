import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

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
  updateDocsById,
  deleteDocsById,
};
