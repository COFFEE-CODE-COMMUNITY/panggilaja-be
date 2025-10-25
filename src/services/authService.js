import prisma from "../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

const registerUser = async ({ username, email, password }) => {
  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError("Email already registered", "AUTH_EMAIL_TAKEN");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await tx.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        login_provider: "manual",
      },
    });

    await tx.userRoleMap.create({
      data: {
        user_id: newUser.id,
        role: "USER",
      },
    });

    const buyerProfile = await tx.buyerProfile.create({
      data: {
        user_id: newUser.id,
        fullname: username || null,
        total_order: 0,
      },
    });

    await tx.alamatBuyer.create({
      data: {
        id_buyer: buyerProfile.id,
        alamat: null,
        provinsi: null,
        kota: null,
        kecamatan: null,
        kode_pos: null,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: "BUYER",
    };
  });
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError(
      "Email and password required",
      "AUTH_MISSING_CREDENTIAL"
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true, buyerProfile: true, sellerProfile: true },
  });

  console.log(user);
  if (!user) throw new NotFoundError("User not found", "AUTH_USER_NOT_FOUND");

  const isValid = await bcrypt.compare(password, user.password || "");
  if (!isValid) {
    throw new BadRequestError("Invalid credentials", "AUTH_BAD_CREDENTIAL");
  }

  const payload = {
    user: {
      id: user.id,
      id_buyer: user.buyerProfile.id,
      email: user.email,
      username: user.username,
      roles: "BUYER",
    },
  };

  console.log(payload);

  const accessToken = jwt.sign(payload, config.jwt_key.access_key, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign(payload, config.jwt_key.refresh_key, {
    expiresIn: "365d",
  });

  const { exp } = jwt.decode(refreshToken);
  await prisma.refreshToken.create({
    data: {
      user_id: user.id,
      token: refreshToken,
      expired_at: new Date(exp * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: payload.user,
  };
};

const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token required!", "TOKEN_MISSING");
  }

  const tokenData = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: { include: { roles: true } } },
  });

  if (!tokenData || tokenData.revoked) {
    throw new NotFoundError("Token not found or revoked", "TOKEN_REVOKED");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt_key.refresh_key);
  } catch (err) {
    if (err.message === "jwt expired") {
      throw new UnauthorizedError("Refresh token expired", "TOKEN_EXPIRED");
    }
    throw new ForbiddenError("Invalid refresh token", "TOKEN_INVALID");
  }

  if (tokenData.user_id !== decoded.user.id) {
    throw new ForbiddenError("Token mismatch", "TOKEN_INVALID");
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
    throw new BadRequestError("No token provided", "ALREADY_LOGOUT");
  }

  const updated = await prisma.refreshToken.updateMany({
    where: { token: refreshToken, revoked: false },
    data: { revoked: true },
  });

  if (updated.count === 0) {
    throw new NotFoundError("Token not found", "TOKEN_NOT_FOUND");
  }

  return { message: "Logout successful" };
};

async function switchUser(token) {
  console.log(token);
  const user = await prisma.user.findUnique({
    where: { id: token.id },
    include: { roles: true, buyerProfile: true, sellerProfile: true },
  });

  if (user.roles.length > 1) {
    console.log(token);
    if (token.roles === "BUYER") {
      console.log("Masuk sini");
      const payload = {
        user: {
          id: user.id,
          id_seller: user.sellerProfile.id,
          email: user.email,
          username: user.username,
          roles: "SELLER",
        },
      };
      const newToken = jwt.sign(payload, config.jwt_key.access_key, {
        expiresIn: "10m",
      });

      return newToken;
    }

    if (token.roles === "SELLER") {
      console.log("Masuk sini");
      const payload = {
        user: {
          id: user.id,
          id_buyer: user.buyerProfile.id,
          email: user.email,
          username: user.username,
          roles: "BUYER",
        },
      };
      const newToken = jwt.sign(payload, config.jwt_key.access_key, {
        expiresIn: "10m",
      });

      return newToken;
    }
  } else {
    throw new UnauthorizedError(
      "Akun seller/user tidak ditemukan",
      "ACCOUNT_NOT_FOUND"
    );
  }
}

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  switchUser,
};
