import dotenv from "dotenv";

dotenv.config();

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  jwt_expired: process.env.JWT_EXPIRED_IN,
  jwt_key: {
    access_key: process.env.ACCESS_TOKEN_SECRET,
    refresh_key: process.env.REFRESH_TOKEN_SECRET,
  },
};

export default config;
