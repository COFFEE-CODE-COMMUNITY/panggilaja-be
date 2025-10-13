// services/resetService.js
import prisma from "../database/prisma.js";
import bcrypt from "bcrypt";
import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { sendEmailBrevo } from "../utils/brevo/email.js";

function random6() {
  return (Math.floor(Math.random() * 1_000_000) + "").padStart(6, "0");
}

export async function requestReset({ email }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError("User not found", "AUTH_USER_NOT_FOUND");
  }

  // rate-limit sederhana: tolak jika ada kode aktif < 60 detik terakhir (opsional)
  const recent = await prisma.passwordReset.findFirst({
    where: {
      user_id: user.id,
      used: false,
      expired_at: { gt: new Date() },
      created_at: { gt: new Date(Date.now() - 60 * 1000) }, // 60s
    },
    orderBy: { created_at: "desc" },
  });
  if (recent) {
    throw new BadRequestError(
      "Too many requests. Try again in a minute.",
      "RESET_RATE_LIMIT"
    );
  }

  const code = random6(); // simpan hash-nya, kirim plaintext via email
  const hashed = await bcrypt.hash(code, 10);
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

  await prisma.passwordReset.create({
    data: {
      user_id: user.id,
      code: hashed, // simpan HASH, bukan plaintext
      expired_at: expiredAt,
    },
  });

  // kirim email ke user (jangan hardcode)
  await sendEmailBrevo({
    fromName: "PanggilAja! (Dev mode)",
    fromEmail: "noreply@naycaaido.site",
    to: email,
    subject: "Kode Reset Password Anda",
    html: `<p>Kode reset password anda:</p>
           <p style="font-size:20px"><b>${code}</b></p>
           <p>Kode berlaku 10 menit.</p>`,
  });

  return { ok: true };
}

export async function verifyReset({ email, resetCode }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new BadRequestError("User not found", "AUTH_USER_NOT_FOUND");

  const record = await prisma.passwordReset.findFirst({
    where: {
      user_id: user.id,
      used: false,
      expired_at: { gt: new Date() },
    },
    orderBy: { created_at: "desc" },
  });

  if (!record) {
    throw new BadRequestError(
      "Code invalid or expired",
      "AUTH_RESETCODE_INVALID"
    );
  }

  const ok = await bcrypt.compare(resetCode, record.code);
  if (!ok) {
    throw new BadRequestError("Code invalid", "AUTH_RESETCODE_INVALID");
  }

  return { ok: true };
}

export async function resetPassword({ email, resetCode, newPassword }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new BadRequestError("User not found", "AUTH_USER_NOT_FOUND");

  const record = await prisma.passwordReset.findFirst({
    where: {
      user_id: user.id,
      used: false,
      expired_at: { gt: new Date() },
    },
    orderBy: { created_at: "desc" },
  });
  if (!record) {
    throw new BadRequestError(
      "Code invalid or expired",
      "AUTH_RESETCODE_INVALID"
    );
  }

  const ok = await bcrypt.compare(resetCode, record.code);
  if (!ok) {
    throw new BadRequestError("Code invalid", "AUTH_RESETCODE_INVALID");
  }

  const hashPw = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { password: hashPw },
    });

    await tx.passwordReset.update({
      where: { id: record.id },
      data: { used: true },
    });

    // opsional: revoke semua refresh token aktif user setelah reset password
    await tx.refreshToken.updateMany({
      where: { user_id: user.id, revoked: false },
      data: { revoked: true },
    });
  });

  return { ok: true };
}
