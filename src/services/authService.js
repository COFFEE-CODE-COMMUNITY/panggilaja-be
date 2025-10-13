// services/authService.js
import prisma from "../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import BadRequestError from "../exceptions/BadRequestError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

const registerUser = async ({ username, email, password }) => {
  const userAvail = await prisma.user.findUnique({ where: { email } });
  if (userAvail) {
    throw new BadRequestError("Email already registered", "AUTH_EMAIL_TAKEN");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashPassword,
      login_provider: "manual",
    },
  });

  return newUser;
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError(
      "Email and Password required",
      "AUTH_MISSING_CREDENTIAL"
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new BadRequestError("User not found", "AUTH_USER_NOT_FOUND");

  const valid = await bcrypt.compare(password, user.password || "");
  if (!valid) {
    throw new BadRequestError(
      "Email or password is not valid",
      "AUTH_BAD_CREDENTIAL"
    );
  }

  const payload = {
    user: { username: user.username, email: user.email, id: user.id },
  };

  const accessToken = jwt.sign(payload, config.jwt_key.access_key, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign(payload, config.jwt_key.refresh_key, {
    expiresIn: "365d",
  });

  // decode exp → simpan expired_at
  const { exp } = jwt.decode(refreshToken);
  await prisma.refreshToken.create({
    data: {
      user_id: user.id,
      token: refreshToken,
      expired_at: new Date(exp * 1000),
    },
  });

  return { accessToken, refreshToken };
};

const refreshToken = async ({ refreshToken: rt }) => {
  if (!rt) {
    throw new BadRequestError("Refresh token required!", "TOKEN_MISSING");
  }

  const tokenData = await prisma.refreshToken.findUnique({
    where: { token: rt },
    include: { user: true },
  });
  if (!tokenData || tokenData.revoked) {
    throw new NotFoundError("Token not found!", "TOKEN_REVOKED");
  }

  let decoded;
  try {
    decoded = jwt.verify(rt, config.jwt_key.refresh_key);
  } catch (err) {
    if (err?.message === "jwt expired") {
      throw new UnauthorizedError("Token already expired", "TOKEN_EXPIRED");
    }
    throw new ForbiddenError("Refresh token not valid", "TOKEN_INVALID");
  }

  if (tokenData.user_id !== decoded.user.id) {
    throw new ForbiddenError("Refresh token not valid", "TOKEN_INVALID");
  }

  const accessToken = jwt.sign(
    { user: decoded.user },
    config.jwt_key.access_key,
    { expiresIn: "10m" }
  );

  return accessToken;
};

const logoutUser = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new BadRequestError("User already logout", "ALREADY_LOGOUT");
  }
  // lebih aman: mark revoked, bukan delete (jejak audit)
  const updated = await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true },
  });
  return updated;
};

export default {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
