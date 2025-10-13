class ForbiddenError extends Error {
  constructor(message, errorCode, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ForbiddenError";
    this.errorCode = errorCode;
  }
}

export default ForbiddenError;
