exports.errorGenerate = (message, statusCode = 500, data) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  data && (err.data = data);
  throw err;
};
