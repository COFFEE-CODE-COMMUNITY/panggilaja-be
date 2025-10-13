import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  jwt_expired: process.env.JWT_EXPIRED_IN,
  jwt_key: {
    access_key: process.env.ACCESS_TOKEN_SECRET,
    refresh_key: process.env.REFRESH_TOKEN_SECRET,
  },
  brevo_api_key: process.env.BREVO_API_KEY,
};

export default config;
