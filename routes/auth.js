const { Router } = require("express");
const {
  signup,
  sendOTP,
  verifyOTP,
  login,
  forgetPassword,
  logout,
  refresh,
  resetPassword,
} = require("../controllers/auth");
const { limiter } = require("../middlewares/rateLimiter");

const router = new Router();

router.post("/register", limiter, signup, sendOTP);

router.post("/verify", verifyOTP);

router.post("/login", login);

router.post("/send-otp", signup, sendOTP);

router.post("/forget-password", forgetPassword);

router.post("/reset-password", resetPassword);

router.get("/logout", logout);

router.get("/refresh", refresh);

module.exports = router;
