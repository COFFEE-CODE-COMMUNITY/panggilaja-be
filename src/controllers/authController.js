import authService from "../services/authService.js";
import BadRequestError from "../exceptions/BadRequestError.js";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      const error = new BadRequestError("All fields are mandatory");
      return next(error);
    }

    const newUser = await authService.registerUser(req.body);

    if (newUser) {
      res.status(201).json({
        _id: newUser.id,
        email: newUser.email,
      });
    } else {
      const error = new BadRequestError("User data is not valid");
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      const error = new Error("All fields are mandatory");
      return next(error);
    }

    const token = await authService.loginUser(req.body);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });

    res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (req, res, next) => {
  res.send("Ini refresh token");
  authService.refreshToken(req.body)
};

const logoutUser = async (req, res, next) => {
  res.clearCookie("refreshToken");
  res.send("Cookie berhasil dihapus");
};

export default { registerUser, loginUser,refreshToken };
