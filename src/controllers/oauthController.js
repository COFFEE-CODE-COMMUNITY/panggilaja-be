import { authCallback } from "../services/oauthService.js";
import { authorizationUrl } from "../utils/oauthClient.js";

const authCallbackController = async (req, res, next) => {
  try {
    // kirimkan kode yang diterima Google (req.query.code), bukan seluruh req.query
    const authData = await authCallback(req.query.code);

    // Redirect ke frontend dengan token dan user data sebagai query parameters
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/google/callback?token=${authData.accessToken}&user=${encodeURIComponent(JSON.stringify(authData.user))}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    // Redirect ke frontend dengan error message
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=Gagal login dengan Google`);
  }
};

const authLoginController = (req, res, next) => {
  res.redirect(authorizationUrl);
};

export { authCallbackController, authLoginController };
