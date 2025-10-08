const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        details: error.details.map((e) => e.message),
      });
    }
    next();
  };
};

export default validate;
