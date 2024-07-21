const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, //1 minute
  max: 5, // limit each IP to 5 requests per window per minute
  message: {
    message: "Too many attempts from this IP, please try again after 60 sec",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { limiter };
