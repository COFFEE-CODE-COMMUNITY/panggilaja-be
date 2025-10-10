import Joi from "joi";

const addService = Joi.object({
  nama_jasa: Joi.string().max(50).required(),
  deskripsi: Joi.string().required(),
  base_price: Joi.number().min(0).required(),
  top_price: Joi.number().min(Joi.ref("base_price")).required(),
  foto_product: Joi.string().uri().optional(),
  status: Joi.string().valid("active", "inactive").required(),
});

export default {
  addService,
};
