import prisma from "../database/prisma.js";

export async function findOrCreateGoogleUser(profile) {
  const email = profile.emails?.[0]?.value;
  const googleId = profile.id;
  const name =
    profile.displayName ??
    `${profile.name?.givenName ?? ""} ${profile.name?.familyName ?? ""}`.trim();
  const avatar = profile.photos?.[0]?.value;

  if (!email) throw new Error("Google profile has no email");

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        googleId,
        avatar,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId },
    });
  }

  return user;
}

export async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export default { findOrCreateGoogleUser, findById };
