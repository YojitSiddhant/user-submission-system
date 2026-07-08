function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const isMulterError = err.name === "MulterError";
  const statusCode = err.statusCode || (isMulterError ? 400 : 500);
  const message = err.message || "Internal Server Error";
  const responseMessage =
    err.code === "LIMIT_FILE_SIZE"
      ? "Attachment is too large. Please upload a file smaller than the allowed limit."
      : message;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    message: responseMessage,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

module.exports = {
  notFound,
  errorHandler,
};
