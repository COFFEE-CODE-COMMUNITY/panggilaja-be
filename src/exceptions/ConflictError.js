class ConflictError extends Error {
  constructor(message, statusCode = 409) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ConflictError";
  }
}

export default ConflictError;
