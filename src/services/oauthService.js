import { google } from "googleapis";
import prisma from "../database/prisma.js";
import { oauth2Client } from "../utils/oauthClient.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

async function findOrCreateUserGoogle(data) {
  return await prisma.$transaction(async (tx) => {
    let existingUser = await tx.user.findUnique({
      where: { email: data.email },
      include: {
        buyerProfile: true,
        sellerProfile: true,
        roles: true,
      },
    });

    if (!existingUser) {
      const newUser = await tx.user.create({
        data: {
          username: data.name || data.email.split("@")[0],
          email: data.email,
          password: null, // karena OAuth
          login_provider: "google",
          oauth_id: data.id,
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
          fullname: newUser.username,
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

      return newUser;
    }

    return existingUser;
  });
}

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

async function authCallback(code) {
  try {
    if (!code) throw new Error("Missing authorization code");

    // ambil token dari Google
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // ambil profile user
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    if (!data.email) throw new Error("Email tidak ditemukan dari Google");

    // Transaction: cari atau buat user. Gunakan field yang ada di schema.prisma
    const user = await findOrCreateUserGoogle(data);

    // Generate JWT tokens
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
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error in authCallback:", error);
    throw error;
  }
}

export { authCallback, findOrCreateUserGoogle };
