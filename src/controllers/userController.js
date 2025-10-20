import userService from "../services/userService.js";

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await userService.getUserById(id);
    res.status(200).json({
      status: "success",
      message: `Success Get Current User by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await userService.getAddressById(id);
    res.status(200).json({
      status: "success",
      message: `Success Get Current Address User by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const result = await userService.updateUserById(id, data);

    res.status(200).json({
      status: "success",
      message: `Success Update Current User by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await userService.deleteUserById(id);
    res.status(200).json({
      status: "success",
      message: `Success Delete Current User by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserById,
  getAddressById,
  updateUserById,
  deleteUserById,
};
