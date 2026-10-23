// global error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  // Handle Mongoose Invalid ObjectId CastError
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  const response = {
    message: process.env.NODE_ENV === "production" && status === 500 
      ? "Internal server error" 
      : message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;