const routeNotFound = (req, res) => {
  return res.status(404).json({
    status: false,
    message: "route not found",
  });
};

const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    status: false,
    message: err.message || "internal server error",
  });
};

module.exports = { routeNotFound, errorHandler };
