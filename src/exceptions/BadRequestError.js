class BadRequestError extends Error {
  constructor(message, errorCode, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "BadRequestError";
    this.errorCode = errorCode;
  }
}

export default BadRequestError;
