class UnauthorizedError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
