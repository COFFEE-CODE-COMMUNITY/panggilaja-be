// validator/authValidation.js
import Joi from "joi";

/* =======================
   REGISTER
======================= */
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.base": "Username harus berupa teks",
    "string.empty": "Username tidak boleh kosong",
    "string.min": "Username minimal 3 karakter",
    "any.required": "Username wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password minimal 6 karakter",
    "string.max": "Password maksimal 128 karakter",
    "any.required": "Password wajib diisi",
  }),
});

/* =======================
   LOGIN
======================= */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),
});

/* =======================
   REFRESH TOKEN
======================= */
const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token wajib dikirim",
  }),
});

/* =======================
   REQUEST RESET
======================= */
const requestResetSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
});

/* =======================
   VERIFY RESET CODE
======================= */
const verifyResetSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  resetCode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Kode reset harus terdiri dari 6 digit angka",
      "any.required": "Kode reset wajib diisi",
    }),
});

/* =======================
   RESET PASSWORD
======================= */
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  resetCode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Kode reset harus terdiri dari 6 digit angka",
      "any.required": "Kode reset wajib diisi",
    }),
  newPassword: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password minimal 6 karakter",
    "string.max": "Password maksimal 128 karakter",
    "any.required": "Password baru wajib diisi",
  }),
});

/* =======================
   SWITCH USER
======================= */
const switchUserSchema = Joi.object({
  targetRole: Joi.string().valid("buyer", "seller").required().messages({
    "string.base": "Target role harus berupa teks",
    "any.only": "Target role harus 'buyer' atau 'seller'",
    "any.required": "Target role wajib diisi",
  }),
});

/* =======================
   EXPORT
======================= */
export default {
  registerSchema,
  loginSchema,
  refreshSchema,
  requestResetSchema,
  verifyResetSchema,
  resetPasswordSchema,
  switchUserSchema,
};
