const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const accessToken = req.cookies.access;

  if (!accessToken) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
  }
};

const decideAuthMiddleware = (req, res, next) => {
  const accessToken = req.cookies.access;
  if (accessToken) {
    return verifyAccessToken(req, res, next);
  }
  //skip this middleware
  next();
};

module.exports = {
  verifyAccessToken,
  decideAuthMiddleware,
};
