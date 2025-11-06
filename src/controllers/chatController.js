import chatService from "../services/chatService.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

// buyer
const getSellersForSidebar = async (req, res, next) => {
  try {
    const id = req.params.buyerId;
    const loggedInBuyerId = req.user.id_buyer;

    // validasi id pada token dan parameter
    if (id !== loggedInBuyerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

    const result = await chatService.getSellersForSidebar(id);
    res.status(200).json({
      status: "success",
      message: `Success Get All Contact by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// seller
const getBuyersForSidebar = async (req, res, next) => {
  try {
    const id = req.params.sellerId;
    const loggedInSellerId = req.user.id_seller;

    // validasi id pada token dan parameter
    if (id !== loggedInSellerId) {
      throw new UnauthorizedError("Access denied", "UNAUTHORIZED");
    }

    const result = await chatService.getBuyersForSidebar(id);
    res.status(200).json({
      status: "success",
      message: `Success Get All Contact by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { id: partner_id } = req.params;
    const { active_role: roles } = req.user;

    let myId;
    if (roles === "buyer") {
      myId = req.user.id_buyer;
    } else if (roles === "seller") {
      myId = req.user.id_seller;
    }

    const messages = await chatService.getMessages(roles, myId, partner_id);

    res.status(200).json({
      success: true,
      message: "Success get all messages",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { active_role: roles } = req.user;
    const data = req.body;

    let id_buyer;
    let id_seller;
    let senderId;
    let receiverId;

    if (roles === "buyer") {
      id_buyer = req.user.id_buyer;
      id_seller = data.receiverId;
      senderId = id_buyer;
      receiverId = id_seller;
    } else {
      id_seller = req.user.id_seller;
      id_buyer = data.receiverId;
      senderId = id_seller;
      receiverId = id_buyer;
    }

    const result = await chatService.sendMessage(
      id_buyer,
      id_seller,
      data,
      roles.toUpperCase()
    );

    const roomId = `${id_buyer}_${id_seller}`;

    if (req.io) {
      req.io.to(roomId).emit("receive_message", result);
      console.log(`📣 Emitting message to room ${roomId}`);
    } else {
      console.log("Socket.io (io) not attached to request. Skipping emit.");
    }

    console.log(`📣 Emitting message to room ${roomId}`, {
      from: senderId,
      to: receiverId,
    });

    res.status(201).json({
      status: "success",
      message: "Message has been added!",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    next(error);
  }
};

export default {
  getSellersForSidebar,
  getBuyersForSidebar,
  getMessages,
  sendMessage,
};
