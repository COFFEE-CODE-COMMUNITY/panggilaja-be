import { google } from "googleapis";
import prisma from "../database/prisma.js";
import { oauth2Client } from "../utils/oauthClient.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

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
    const user = await prisma.$transaction(async (tx) => {
      let existing = await tx.user.findUnique({
        where: { email: data.email },
      });

      if (!existing) {
        existing = await tx.user.create({
          data: {
            email: data.email,
            username: data.name,
            oauth_id: data.id,
            login_provider: "google", // sesuaikan dengan enum di schema.prisma jika berbeda
          },
        });

        console.log(existing);

        await tx.userRoleMap.create({
          data: {
            user_id: existing.id,
            role: "USER",
          },
        });

        const buyerProfile = await tx.buyerProfile.create({
          data: {
            user_id: existing.id,
            fullname: existing.username,
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

        // Reload user with relationships
        existing = await tx.user.findUnique({
          where: { id: existing.id },
          include: { buyerProfile: true, roles: true },
        });
        console.log(existing);
      } else if (!existing.oauth_id) {
        existing = await tx.user.update({
          where: { id: existing.id },
          data: { oauth_id: data.id, login_provider: "google" },
        });

        // Also reload existing user to get buyerProfile
        existing = await tx.user.findUnique({
          where: { id: existing.id },
          include: { buyerProfile: true, roles: true },
        });

        // If existing user doesn't have buyerProfile, create one
        if (!existing.buyerProfile) {
          const buyerProfile = await tx.buyerProfile.create({
            data: {
              user_id: existing.id,
              fullname: existing.username || data.name,
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

          // Reload user again to include buyerProfile
          existing = await tx.user.findUnique({
            where: { id: existing.id },
            include: { buyerProfile: true, roles: true },
          });
        }
      }

      return existing;
    });

    // Generate JWT tokens
    const payload = {
      user: {
        id: user.id,
        id_buyer: user.buyerProfile?.id || null,
        email: user.email,
        username: user.username,
        roles: "BUYER",
      },
    };

    const accessToken = jwt.sign(payload, config.jwt_key.access_key, {
      expiresIn: "10m",
    });

    const refreshToken = jwt.sign(payload, config.jwt_key.refresh_key, {
      expiresIn: "365d",
    });

    // Store refresh token in database
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
        role: "BUYER",
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error in authCallback:", error);
    throw error;
  }
}

export { authCallback };
