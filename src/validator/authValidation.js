import joi from "joi";

const authSchema = joi.object({
  username: joi.string().required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.base": "Username harus berupa text",
    "any.required": "Username wajib diisi",
  }),
  email: joi.string().email().required().messages({
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Format email tidak valid",
    "string.base": "Email harus berupa text",
    "any.required": "Email wajib diisi",
  }),
  password: joi.string().min(8).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 8 karakter",
    "string.base": "Password harus berupa text",
    "any.required": "Password wajib diisi",
  }),
});

export default authSchema;
