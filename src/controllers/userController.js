import userService from "../services/userService.js";

const getById = async (req, res, next) => {
  try {
    console.log("jalan");
    console.warn(req.user);
    const id = req.user.id;
    const result = await userService.getById(id);
    res.status(200).json({
      message: "Success Get Current User",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getById,
};
