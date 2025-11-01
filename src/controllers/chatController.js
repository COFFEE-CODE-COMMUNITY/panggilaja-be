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
    const { partner_id } = req.params;
    const { roles, id: myId } = req.user;

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
    const roles = req.user.roles;
    let id_buyer;
    let id_seller;

    if (roles === "BUYER") {
      id_buyer = req.user.id_buyer;
      id_seller = "2a2d2292-204f-47ca-911c-6cf8555e9a04";
    } else {
      id_seller = req.user.id_seller;
      id_buyer = "0fa64eb0-9d14-4ed2-8f97-13ef6e5dc5af";
    }

    const data = req.body;
    const result = await chatService.sendMessage(id_buyer, id_seller, data);
    res.status(201).json({
      status: "success",
      message: "Message has been added!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSellersForSidebar,
  getBuyersForSidebar,
  getMessages,
  sendMessage,
};
