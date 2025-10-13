class UnauthorizedError extends Error {
  constructor(message, errorCode, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = "UnauthorizedError";
    this.errorCode = errorCode;
  }
}

export default UnauthorizedError;
