class ConflictError extends Error {
  constructor(message, errorCode, statusCode = 409) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ConflictError";
    this.errorCode = errorCode;
  }
}

export default ConflictError;
