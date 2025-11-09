import {
  authCallback,
  findOrCreateUserGoogle,
} from "../services/oauthService.js";
import { authorizationUrl } from "../utils/oauthClient.js";

const authCallbackController = async (req, res, next) => {
  try {
    // kirimkan kode yang diterima Google (req.query.code), bukan seluruh req.query
    const authData = await authCallback(req.query.code);
    console.log("📥 Received Google callback with code:", req.query.code);

    res.cookie("refreshToken", authData.refreshToken, {
      httpOnly: true, // ✅ Ubah ke true untuk keamanan
      secure: process.env.NODE_ENV === "production", // true kalau production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
    });

    // Redirect ke frontend dengan token dan user data sebagai query parameters
    const frontendUrl = process.env.FRONTEND_URL || "https://panggilaja.space";
    const redirectUrl = `${frontendUrl}/auth/google/callback?token=${
      authData.accessToken
    }&user=${encodeURIComponent(JSON.stringify(authData.user))}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    // Redirect ke frontend dengan error message
    const frontendUrl = process.env.FRONTEND_URL || "http://panggilaja.space";
    res.redirect(`${frontendUrl}/login?error=Gagal login dengan Google`);
  }
};

const authLoginController = (req, res, next) => {
  res.redirect(authorizationUrl);
};

const verifyGoogleTokenController = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.google_client_id,
    });

    const payload = ticket.getPayload();

    res.send(payload);

    // Buat user baru atau cari existing user
    const user = await authService.findOrCreateUserGoogle({
      id: payload.sub,
      displayName: payload.name,
      emails: [{ value: payload.email }],
    });

    const { accessToken, refreshToken } = await authService.loginUser({
      email: user.email,
      password: "", // kosong karena Google
    });

    res.json({
      status: "success",
      message: "Login dengan Google berhasil",
      data: { accessToken, refreshToken, user },
    });
  } catch (error) {
    console.error("OAuth verify failed:", error);
    next(error);
  }
};

export {
  authCallbackController,
  authLoginController,
  verifyGoogleTokenController,
};
