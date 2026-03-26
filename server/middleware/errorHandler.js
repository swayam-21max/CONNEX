/**
 * Centralized Error Handler Middleware
 *
 * Intercepts all errors passed via next(err) and returns consistent
 * JSON error responses with appropriate HTTP status codes.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Mongoose validation error (e.g., required field missing)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    // Provide a more descriptive overall message if available
    if (errors.length > 0) message = errors[0].message;
  }

  // Mongoose bad ObjectId (e.g., /contacts/notanid)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // MongoDB duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `An item with this ${field} already exists`;
    errors = [{ field, message }];
  }

  // Log the error in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${err.stack || err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors || undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
