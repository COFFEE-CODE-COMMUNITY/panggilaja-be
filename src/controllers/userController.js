import userService from "../services/userService.js";

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await userService.getUserById(id);
    res.status(200).json({
      message: `Success Get Current User by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userData = {
      fullname: req.body.fullname,
      foto_user: req.body.foto_user,
    };
    const addressData = {
      user_id: id,
      alamat: req.body.alamat,
      provinsi: req.body.provinsi,
      kota: req.body.kota,
      kecamatan: req.body.kecamatan,
      kode_pos: req.body.kode_pos,
    };

    const result = await userService.updateUserById(id, userData, addressData);

    res.status(200).json({
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
      message: `Success Delete Current User by Id: ${id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserById,
  updateUserById,
  deleteUserById,
};
