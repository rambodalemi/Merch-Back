const User = require("../models/user");

function authorize(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const user = await User.findById(req.user);
      if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
        return next();
      }
      return res.status(403).json({
        status: "error",
        message: "Forbidden",
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  authorize,
};
