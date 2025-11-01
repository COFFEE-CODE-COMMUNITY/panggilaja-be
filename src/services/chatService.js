import prisma from "../database/prisma.js";
// import NotFoundError from "../exceptions/NotFoundError.js";
// import cloudinary from "../utils/cloudinary.js";

// buyer
const getSellersForSidebar = async (buyer_id) => {
  try {
    const contacts = await prisma.message.findMany({
      where: { buyer_id },
      distinct: ["seller_id"],
      include: {
        seller: {
          select: { id: true, nama_toko: true, foto_toko: true },
        },
      },
    });

    if (contacts.length === 0) return [];

    const results = await Promise.all(
      contacts.map(async (contact) => {
        const sellerId = contact.seller_id;

        const lastMessage = await prisma.message.findFirst({
          where: { buyer_id, seller_id: sellerId },
          orderBy: { created_at: "desc" },
          select: { text: true, image: true, created_at: true },
        });

        const unreadCount = await prisma.message.count({
          where: {
            buyer_id,
            seller_id: sellerId,
            seen: false,
          },
        });

        return {
          id: contact.seller.id,
          nama_toko: contact.seller.nama_toko,
          foto_toko: contact.seller.foto_toko,
          lastMessage,
          unreadCount,
        };
      })
    );

    return results;
  } catch (err) {
    console.error("Error fetching sidebar data:", err.message);
    throw err;
  }
};

// seller
const getBuyersForSidebar = async (seller_id) => {
  try {
    const contacts = await prisma.message.findMany({
      where: { seller_id },
      distinct: ["buyer_id"],
      include: {
        buyer: {
          select: { id: true, fullname: true, foto_buyer: true },
        },
      },
    });

    if (contacts.length === 0) return [];

    const results = await Promise.all(
      contacts.map(async (contact) => {
        const buyerId = contact.buyer_id;

        const lastMessage = await prisma.message.findFirst({
          where: { seller_id, buyer_id: buyerId },
          orderBy: { created_at: "desc" },
          select: { text: true, image: true, created_at: true },
        });

        const unreadCount = await prisma.message.count({
          where: {
            seller_id,
            buyer_id: buyerId,
            seen: false,
          },
        });

        return {
          id: contact.buyer.id,
          nama: contact.buyer.nama,
          foto_profile: contact.buyer.foto_profile,
          lastMessage,
          unreadCount,
        };
      })
    );

    return results;
  } catch (err) {
    console.error("Error fetching sidebar data:", err.message);
    throw err;
  }
};

const getMessages = async (roles, myId, partner_id) => {
  try {
    let messages;

    if (roles === "buyer") {
      messages = await prisma.message.findMany({
        where: {
          buyer_id: myId,
          seller_id: partner_id,
        },
        orderBy: { created_at: "asc" },
      });

      await prisma.message.updateMany({
        where: {
          buyer_id: myId,
          seller_id: partner_id,
          seen: false,
        },
        data: { seen: true },
      });
    } else if (roles === "seller") {
      messages = await prisma.message.findMany({
        where: {
          buyer_id: partner_id,
          seller_id: myId,
        },
        orderBy: { created_at: "asc" },
      });

      await prisma.message.updateMany({
        where: {
          buyer_id: partner_id,
          seller_id: myId,
          seen: false,
        },
        data: { seen: true },
      });
    }

    return messages;
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    throw err;
  }
};

const sendMessage = async (id_buyer, id_seller, data) => {
  try {
    const newMessage = await prisma.Message.create({
      data: {
        seller_id: id_seller,
        buyer_id: id_buyer,
        text: data.text,
      },
    });

    return newMessage;
  } catch (err) {
    console.error("Error add new message:", err.message);
    throw err;
  }
};

const markMessagesAsSeen = async (buyerId, sellerId) => {
  await prisma.message.updateMany({
    where: {
      buyer_id: buyerId,
      seller_id: sellerId,
      seen: false,
    },
    data: { seen: true },
  });
};

export default {
  getSellersForSidebar,
  getBuyersForSidebar,
  getMessages,
  sendMessage,
  markMessagesAsSeen,
};
