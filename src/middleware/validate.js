// middleware/validate.js
export default (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({
        status: "failed",
        message: "Validation error",
        data: { errors: messages },
      });
    }
    next();
  };
};
