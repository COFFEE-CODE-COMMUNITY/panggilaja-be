class NotFoundError extends Error {
  constructor(message, errorCode, statusCode = 404) {
    super(message);
    this.statusCode = statusCode;
    this.name = "NotFoundError";
    this.errorCode = errorCode;
  }
}

export default NotFoundError;
