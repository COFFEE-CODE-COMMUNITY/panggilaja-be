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
    // ⚠️ PERBAIKAN: Destructure token dengan benar
    const { accessToken, refreshToken, user } = await authService.loginUser(
      req.body
    );

    // Set refresh token di cookie (HTTP-only untuk keamanan)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // ✅ Ubah ke true untuk keamanan
      secure: process.env.NODE_ENV === "production", // true kalau production (HTTPS)
      sameSite: "lax", // penting untuk cross-origin
      path: "/",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
    });

    // Access token dikirim di response body (akan disimpan di localStorage)
    res.status(200).json({
      status: "success",
      message: "User login successfully",
      data: {
        user: {
          accessToken,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    console.log("🔄 Refresh token endpoint dipanggil");
    console.log("Cookies:", req.cookies);

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      console.error("❌ Refresh token tidak ditemukan di cookies");
      throw new BadRequestError("Refresh token missing", "TOKEN_MISSING");
    }

    console.log("✅ Refresh token ditemukan, memproses...");
    const accessToken = await authService.refreshAccessToken({ refreshToken });

    console.log("✅ Access token baru berhasil dibuat");
    res.status(200).json({
      status: "success",
      message: "New access token created",
      data: { accessToken },
    });
  } catch (e) {
    console.error("❌ Error saat refresh token:", e);
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

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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
    const { targetRole } = req.body;
    if (!targetRole) {
      throw new BadRequestError(
        "Target role is required",
        "MISSING_TARGET_ROLE"
      );
    }

    const result = await authService.switchUser({
      currentToken: req.headers.authorization?.replace("Bearer ", ""),
      targetRole,
    });
    res.json({
      status: "success",
      message: "User role switched successfully",
      data: { user: result.user, accessToken: result.accessToken },
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
