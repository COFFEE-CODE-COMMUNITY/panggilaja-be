class ForbiddenError extends Error {
  constructor(message, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ForbiddenError";
  }
}

export default ForbiddenError;
