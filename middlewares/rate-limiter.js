const ratelimit = require("express-rate-limit");

const limiter = ratelimit({
  windowMs: 60 * 1000, //1min
  max: 5, //limit each Ip  to 5 requests per window per minute
  message: {
    message: "too many attempts from this IP, Pls try again in 1min",
  },
  handler: (req,res,next, options) => {
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {limiter} 
