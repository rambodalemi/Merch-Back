const {
  checkRegister,
  checkOTP,
  checkLogin,
  checkEmail,
  checkReset,
} = require("../validators/auth");
const User = require("../models/user");
const otpGenerator = require("otp-generator");
const mailer = require("../utils/mailer");
const otpTemplate = require("../templates/otp");
const resetTemplate = require("../templates/resetpassword");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/catchAsync");
const { errorGenerate } = require("../utils/errorGenerate");
const crypto = require("crypto");

//register
exports.signup = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;
  if (!password || !email || !username) {
    return errorGenerate("email, username, and password are required", 400);
  }
  const checkData = await checkRegister({ email, username, password });
  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      checkData: checkData,
    });
  }
  const existing_user = await User.findOne({ email }).exec();
  if (existing_user && existing_user.isVerifiedEmail) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login",
    });
  } else if (existing_user) {
    await User.findOneAndUpdate(
      { email },
      { email, password, username },
      { new: true, validateModifiedOnly: true }
    );
    req.userId = existing_user._id;
    next();
  } else {
    const new_user = await User.create({ email, password, username });
    req.userId = new_user._id;
    next();
  }
});

exports.sendOTP = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  const otp_expire_time = Date.now() + 10 * 60 * 1000; //10 min
  const user = await User.findByIdAndUpdate(userId, { otp_expire_time });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  //* send email to the user
  mailer(
    user.email,
    "Verification OTP",
    otpTemplate(user.username, new_otp)
  ).catch(console.error);

  console.log(new_otp);

  res.status(200).json({
    status: "success",
    message: "OTP sent successfully",
  });
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      status: "error",
      message: "email and otp are required",
    });
  }
  const checkData = await checkOTP({ email, otp });
  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      checkData: checkData,
    });
  }
  const user = await User.findOne({
    email,
    otp_expire_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP is expired",
    });
  }

  if (user.isVerifiedEmail) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    return res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  user.isVerifiedEmail = true;
  user.isActive = true;
  user.otp = null;

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  user.refreshToken = refreshToken;
  user.accessToken = accessToken;

  await user.save({ new: true, validateModifiedOnly: true });

  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("access", accessToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({
      status: "error",
      message: "email and password are required",
    });
  }
  const checkData = await checkLogin({ email, password });
  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      checkData: checkData,
    });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  }

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  user.refreshToken = refreshToken;
  user.accessToken = accessToken;

  await user.save({ new: true, validateModifiedOnly: true });

  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("access", accessToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "user login successfully",
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "email is required",
    });
  }
  const checkData = await checkEmail({ email });
  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      checkData: checkData,
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "There is no user with this email address",
    });
  }

  //* Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.WEBSITE_URL}/auth/new-password?token=${resetToken}`;
  console.log(resetURL);

  mailer(
    user.email,
    "Reset Password",
    resetTemplate(user.username, resetURL)
  ).catch(console.error);

  res.status(200).json({
    status: "success",
    message: "Reset url has been sent to your email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, token } = req.body;
  if (!password || !token) {
    return res.status(400).json({
      status: "error",
      message: "token and password are required",
    });
  }
  const checkData = await checkReset({ token, password });
  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      checkData: checkData,
    });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is invalid or expired",
    });
  }

  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpire = null;
  // await user.save()

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  user.refreshToken = refreshToken;
  user.accessToken = accessToken;

  await user.save({ new: true, validateModifiedOnly: true });

  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("access", accessToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.refresh && !cookies.access) {
    return res.sendStatus(204); //No content
  }

  const user = await User.findOne({ refreshToken: cookies.refresh });

  if (!user) {
    res.clearCookie("refresh", {
      httpOnly: true,
      sameSite: "none",
      //secure: true
    });
    res.clearCookie("access", {
      httpOnly: true,
      sameSite: "none",
      //secure: true
    });
    return res.sendStatus(204);
  }

  (user.refreshToken = null), (user.accessToken = null);
  await user.save();

  res.clearCookie("refresh", {
    httpOnly: true,
    sameSite: "none",
    //secure: true
  });
  res.clearCookie("access", {
    httpOnly: true,
    sameSite: "none",
    //secure: true
  });

  res.status(200).json({
    status: "success",
    message: "Cookie cleared",
  });
});

exports.refresh = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies.refresh) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  const refreshToken = cookies.refresh;

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  if (!decoded || !decoded.email) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
  }

  const user = await User.findOne({ email: decoded.email }).exec();

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  user.accessToken = accessToken;

  await user.save({ new: true, validateModifiedOnly: true });

  res.cookie("access", accessToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "Access token updated",
  });
});
