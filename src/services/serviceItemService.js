import { PrismaClient } from "@prisma/client";
import serviceRepository from "../repository/serviceRepository.js";
import serviceValidation from "../validator/serviceValidation.js";
import validate from "../middleware/validate.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const prisma = new PrismaClient();

const addService = async (data) => {
  const seller = await prisma.seller.findUnique({
    where: { id: data.seller_id },
  });
  if (!seller) throw new NotFoundError(404, "Seller not found");

  const newService = await serviceRepository.createService({
    id: uuid(),
    seller_id: data.seller_id,
    nama_jasa: data.nama_jasa,
    deskripsi: data.deskripsi,
    base_price: data.base_price,
    top_price: data.top_price,
    foto_product: data.foto_product,
    status: "active",
    kategori_id: data.kategori_id,
  });

  return newService;
};

// const login = async (payload) => {
//   const userPayload = validate(userValidation.login, payload);

//   try {
//     const user = await userRepository.getUserByEmail(userPayload.email);
//     if (!user || user.email != userPayload.email) {
//       throw new ResponseError(404, "Email or password is wrong");
//     }

//     const passwordValid = await bcrypt.compare(
//       userPayload.password,
//       user.password
//     );
//     if (!passwordValid) {
//       throw new ResponseError(404, "Email or password is wrong");
//     }

//     const jwtPayload = {
//       id: user.id,
//     };

//     const token = jwt.signToken(jwtPayload);

//     return token;
//   } finally {
//     // client.release();
//   }
// };

export default {
  addService,
};
