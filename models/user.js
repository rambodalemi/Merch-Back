const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    username: { type: String, trim: true, unique: true, required: true },
    password: { type: String, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    steamid: {
      type: String,
      unique: true,
    },
    avatar: { type: String },
    biography: { type: String, trim: true },
    favorites: [{ type: ObjectId, ref: "Product" }],
    otp: { type: String },
    otp_expire_time: { type: Date },
    isVerifiedEmail: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    role: { type: String, default: "USER" },
    gameAccount: [{ type: ObjectId, ref: "UserAccount" }],
    basket: {
      totalAmount: { type: Number, default: 0 },
      coupon: { type: ObjectId, ref: "Coupon" },
      totalQTY: { type: Number, default: 0 },
      cartItems: [
        {
          productId: { type: ObjectId, ref: "Product", required: true },
          optionId: { type: ObjectId, ref: "ProductOption" },
          cartQTY: { type: Number },
        },
      ],
    },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpire: { type: Date },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    refreshToken: { type: String },
    accessToken: { type: String },
    userIP: { type: Number },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

userSchema.virtual("avatarUrl").get(function () {
  if (this.avatar) return `${process.env.SERVER_URL}/${this.avatar}`;
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.avatarUrl = this.avatarUrl;
  delete obj.password;
  delete obj.avatar;
  return obj;
};

userSchema.index({
  email: "text",
  username: "text",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("otp") || !this.otp) return next();

  this.otp = await bcrypt.hash(this.otp, 12);

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew || !this.password)
    return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctOTP = async function (candidateOTP, userOTP) {
  return await bcrypt.compare(candidateOTP, userOTP);
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
