class BadRequestError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "BadRequestError";
  }
}

export default BadRequestError;
