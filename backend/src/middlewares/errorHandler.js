import ApiError from "../utils/ApiError.js";
import { config } from "../config/env.js";

// eslint-disable-next-line no-unused-vars

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error.name === "CastError" ? 400 : 500);
    error = new ApiError(
      statusCode,
      error.message || "Internal server error",
      []
    );
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(config.nodeEnv === "development" ? { stack: error.stack } : {}),
  };

  if (config.nodeEnv !== "test") {
    console.error(`[error] ${req.method} ${req.originalUrl} ->`, error.message);
  }

  res.status(error.statusCode || 500).json(response);
}

export default errorHandler;
