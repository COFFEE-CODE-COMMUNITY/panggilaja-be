import prisma from "../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BadRequestError from "../exceptions/BadRequestError.js";

const registerUser = async ({ username, email, password }) => {
  const userAvail = await prisma.user.findUnique({
    where: { email },
  });

  if (userAvail) {
    throw new BadRequestError("Email already registered");
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
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "356d" }
    );

    return { accessToken, refreshToken };
  } else {
    throw new BadRequestError("Email or password is not valid");
  }
};

const refreshToken = async ({ email, refreshToken: refreshTokenUSer }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { refresh_tokens: true },
  });

  const valid = user.refresh_tokens.filter((e) => {
    return e.revoked == false;
  });

  console.log(valid);

  // console.log(user.refresh_tokens);
};

export default { registerUser, loginUser, refreshToken };
