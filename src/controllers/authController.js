import authService from "../services/authService.js";
import * as resetService from "../services/resetService.js";
import BadRequestError from "../exceptions/BadRequestError.js";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new BadRequestError(
        "All fields are mandatory",
        "MISSING_CREDENTIAL"
      );
    }
    const newUser = await authService.registerUser(req.body);
    res.status(201).json({
      status: "success",
      message: "Account created",
      data: { user: { _id: newUser.id, email: newUser.email } },
    });
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const token = await authService.loginUser(req.body);
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      message: "User login succesfully",
      data: { user: { accessToken: token.accessToken } },
    });
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const accessToken = await authService.refreshAccessToken(req.cookies);
    res.json({
      status: "success",
      message: "new access token created",
      data: { user: { accessToken } },
    });
  } catch (e) {
    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const out = await authService.logoutUser(req.cookies);
    if (out) {
      res.clearCookie("refreshToken");
      res.json({
        status: "success",
        message: "User logout successfuly",
        data: {},
      });
    }
  } catch (e) {
    next(e);
  }
};

/** RESET PASSWORD FLOW **/
const requestReset = async (req, res, next) => {
  try {
    await resetService.requestReset(req.body); // { email }
    res.json({
      status: "success",
      message: "Code has been sent to user",
      data: {},
    });
  } catch (e) {
    next(e);
  }
};

const verifyReset = async (req, res, next) => {
  try {
    await resetService.verifyReset(req.body); // { email, resetCode }
    res.json({ status: "success", message: "Code valid", data: {} });
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      throw new BadRequestError("Missing fields", "MISSING_CREDENTIAL");
    }
    await resetService.resetPassword({ email, resetCode, newPassword });
    res.json({ status: "success", message: "Password updated", data: {} });
  } catch (e) {
    next(e);
  }
};

const switchUser = async (req, res, next) => {
  try {
    const newToken = await authService.switchUser(req.user);
    res.json({
      status: "success",
      message: "new access token created",
      data: { user: { accessToken: newToken } },
    });
  } catch (e) {
    next(e);
  }
};

const googleCallback = async (req, res) => {
  res.redirect("/api/auth/profile");
};

export default {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  requestReset,
  verifyReset,
  resetPassword,
  switchUser,
  googleCallback,
};
