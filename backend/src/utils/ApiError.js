class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status code
   * @param {string} message Human-readable error message
   * @param {Array} errors Optional array of field-level validation errors
   */

  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }
  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
