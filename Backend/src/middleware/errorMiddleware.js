"use strict";

function errorMiddleware(err, req, res, next) {
  console.error("ERROR:", err);

  let statusCode = err.statusCode || err.status || 500;
  let message = "An unexpected server error occurred.";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format.";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "This record already exists.";
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File size cannot exceed 5 MB."
        : "File upload failed.";
  } else if (err.status && err.status < 500) {
    statusCode = err.status;
    message = err.message;
  } else if (
    err.message === "Only PDF, DOC and DOCX resumes are allowed."
  ) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = errorMiddleware;