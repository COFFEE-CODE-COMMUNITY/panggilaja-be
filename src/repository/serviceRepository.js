import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findServiceBySellerId = async (seller_id) => {
  return prisma.user.findUnique({
    where: { seller_id },
  });
};

const createService = async (data) => {
  return prisma.service.create({ data });
};

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export default { findServiceBySellerId, createService, getUserByEmail };
