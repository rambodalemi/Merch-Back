exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; //server error
  const message = err.message || "Something went wrong. Try again...";
  const data = err.data;
  if (data) {
    return res.status(statusCode).json({
      message,
      data,
      status: "error",
    });
  }
  res.status(statusCode).json({
    message,
    status: "error",
  });
};
