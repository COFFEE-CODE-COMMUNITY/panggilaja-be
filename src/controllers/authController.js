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
    const { accessToken, refreshToken } = await authService.loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
    });

    res.status(200).json({
      status: "success",
      message: "User login successfully",
      data: {
        accessToken, // ✅ Kirim langsung, bukan nested di user
      },
    });
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    console.log("🔄 Refresh token endpoint called");
    console.log("📦 Cookies received:", req.cookies);

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      console.error("❌ Refresh token not found in cookies");
      throw new BadRequestError("Refresh token missing", "TOKEN_MISSING");
    }

    console.log("✅ Refresh token found, processing...");
    const accessToken = await authService.refreshAccessToken({ refreshToken });

    console.log("✅ New access token created successfully");

    res.status(200).json({
      status: "success",
      message: "Access token refreshed",
      data: {
        accessToken,
      },
    });
  } catch (e) {
    console.error("❌ Error during token refresh:", e.message);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new BadRequestError("No token provided", "TOKEN_MISSING");
    }

    await authService.logoutUser({ refreshToken });

    // ✅ Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.json({
      status: "success",
      message: "User logout successfully",
      data: {},
    });
  } catch (e) {
    next(e);
  }
};

/** RESET PASSWORD FLOW **/
const requestReset = async (req, res, next) => {
  try {
    await resetService.requestReset(req.body);
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
    await resetService.verifyReset(req.body);
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
    const result = await authService.switchUser(req.user);

    console.log(result.refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
    });

    res.json({
      status: "success",
      message: "User role switched successfully",
      data: {
        accessToken: result.accessToken, // ✅ Kirim accessToken
        user: result.user,
      },
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
