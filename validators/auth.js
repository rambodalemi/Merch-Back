const Validator = require("fastest-validator");

const v = new Validator();

const registerSchema = {
  email: { type: "email", normalize: true },
  password: {
    type: "string",
    trim: true,
    min: 8,
    max: 255,
    pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$",
  },
  username: { type: "string", trim: true, min: 3, max: 255 },
  $$strict: true, // no additional properties allowed
};

const verifyOTPSchema = {
  email: { type: "email", normalize: true },
  otp: { type: "string", trim: true },
  $$strict: true,
};

const loginSchema = {
  email: { type: "email", normalize: true },
  password: {
    type: "string",
    trim: true,
    min: 8,
    max: 255,
    pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$",
  },
  $$strict: true, // no additional properties allowed
};

const forgetSchema = {
  email: { type: "email", normalize: true },
  $$strict: true, // no additional properties allowed
};

const resetSchema = {
  token: { type: "string", trim: true },
  password: {
    type: "string",
    trim: true,
    min: 8,
    max: 255,
    pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$",
  },
  $$strict: true, // no additional properties allowed
};

exports.checkRegister = v.compile(registerSchema);
exports.checkOTP = v.compile(verifyOTPSchema);
exports.checkLogin = v.compile(loginSchema);
exports.checkEmail = v.compile(forgetSchema);
exports.checkReset = v.compile(resetSchema);
