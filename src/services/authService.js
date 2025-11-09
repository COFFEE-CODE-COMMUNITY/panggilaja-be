import prisma from "../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";
import { token } from "morgan";

const buildUserPayload = (user, activeRole) => {
  if (!user) {
    throw new Error("User object is required");
  }

  const availableRoles = ["buyer"];

  if (user.sellerProfile && user.roles.some((role) => role.role === "SELLER")) {
    availableRoles.push("seller");
  }

  if (!availableRoles.includes(activeRole)) {
    throw new Error(`User does not have access to ${activeRole} role`);
  }

  const payload = {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      active_role: activeRole,
      available_roles: availableRoles,
    },
  };

  if (activeRole === "buyer" && user.buyerProfile) {
    payload.user.id_buyer = user.buyerProfile.id;
  } else if (activeRole === "seller" && user.sellerProfile) {
    payload.user.id_seller = user.sellerProfile.id;
  } else {
    throw new Error(`Required profile for ${activeRole} role not found`);
  }

  return payload;
};

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

  if (!user) throw new NotFoundError("User not found", "AUTH_USER_NOT_FOUND");

  const isValid = await bcrypt.compare(password, user.password || "");
  if (!isValid) {
    throw new BadRequestError("Invalid credentials", "AUTH_BAD_CREDENTIAL");
  }

  const payload = buildUserPayload(user, "buyer");

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
  };
};

const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token required!", "TOKEN_MISSING");
  }

  const tokenData = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: {
        include: { roles: true, buyerProfile: true, sellerProfile: true },
      },
    },
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

  const activeRole = decoded.user.active_role; // <-- Ambil dari token lama

  const accessToken = jwt.sign(
    buildUserPayload(tokenData.user, activeRole),
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

const switchUser = async (currentToken) => {
  if (!currentToken) {
    throw new BadRequestError("Current token is required", "TOKEN_MISSING");
  }

  // Ambil data user dari database
  const user = await prisma.user.findUnique({
    where: { id: currentToken.id },
    include: { roles: true, buyerProfile: true, sellerProfile: true },
  });

  if (!user) {
    throw new NotFoundError("User not found", "AUTH_USER_NOT_FOUND");
  }

  // Tentukan role target
  let targetRole;
  if (currentToken.active_role === "buyer") {
    targetRole = "seller";
  } else if (currentToken.active_role === "seller") {
    targetRole = "buyer";
  } else {
    throw new ForbiddenError("Invalid current role", "ROLE_INVALID");
  }

  try {
    // Bangun payload baru sesuai role tujuan
    const payload = buildUserPayload(user, targetRole);

    // Buat access token baru
    const newAccessToken = jwt.sign(payload, config.jwt_key.access_key, {
      expiresIn: "10m",
    });

    // Buat refresh token baru untuk role baru
    const newRefreshToken = jwt.sign(payload, config.jwt_key.refresh_key, {
      expiresIn: "365d",
    });

    // Hitung expired date dari refresh token
    const { exp } = jwt.decode(newRefreshToken);
    const expiredAt = new Date(exp * 1000);

    // Simpan refresh token baru dan revoke yang lama
    await prisma.$transaction(async (tx) => {
      // Revoke semua refresh token aktif user
      await tx.refreshToken.updateMany({
        where: { user_id: user.id, revoked: false },
        data: { revoked: true },
      });

      // Simpan refresh token baru
      await tx.refreshToken.create({
        data: {
          user_id: user.id,
          token: newRefreshToken,
          expired_at: expiredAt,
        },
      });
    });

    // Kembalikan hasilnya
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: payload.user,
    };
  } catch (error) {
    if (error.message.includes("does not have access to")) {
      throw new ForbiddenError(
        `User does not have access to ${targetRole} role`,
        "ROLE_ACCESS_DENIED"
      );
    }
    if (error.message.includes("Required profile for")) {
      throw new NotFoundError(
        `Required profile for ${targetRole} role not found`,
        "PROFILE_NOT_FOUND"
      );
    }
    throw error;
  }
};

async function findOrCreateUserGoogle(profile) {
  const email = profile.emails?.[0]?.value;
  const googleId = profile.id;

  // Cari user berdasarkan oauth_id atau email
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ oauth_id: googleId }, { email: email }],
    },
  });

  if (!user) {
    // Jika belum ada, buat user baru
    user = await prisma.user.create({
      data: {
        email: email,
        password: "", // kosong untuk akun google
        username: profile.displayName,
        oauth_id: googleId,
        login_provider: "google",
        roles: {
          create: { role: "USER" },
        },
        buyerProfile: {
          create: { fullname: profile.displayName },
        },
      },
      include: { roles: true, buyerProfile: true },
    });
  }

  return user;
}

async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: true, buyerProfile: true },
  });
}

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  switchUser,
  findOrCreateUserGoogle,
  findUserById,
};
