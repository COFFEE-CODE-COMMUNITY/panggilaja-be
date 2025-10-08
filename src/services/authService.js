import prisma from "../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BadRequestError from "../exceptions/BadRequestError.js";

const cekUser = async (email) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  return user;
};

const registerUser = async ({ username, email, password }) => {
  const userAvail = await cekUser(email);

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
  const user = await cekUser(email);

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
      { expiresIn: "15m" }
    );
    return accessToken;
  } else {
    throw new BadRequestError("Email or password is not valid");
  }
};

export default { registerUser, loginUser };
