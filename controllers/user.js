const User = require("../models/user");
const { errorGenerate } = require("../utils/errorGenerate");
const { catchAsync } = require("../utils/catchAsync");
const { checkUser } = require("../validators/user");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select(
    "-password -accessToken -refreshToken"
  );

  if (!user) {
    errorGenerate("User not found", 404);
  }

  if (user.role === "USER" && user._id.toString() !== userId) {
    errorGenerate("You are not authorized to update this user", 403);
  }

  const checkData = await checkUser({ ...req.body });

  if (checkData !== true) {
    errorGenerate("Invalid inputs", 400, checkData);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { ...req.body } },
    { new: true }
  ).select("-password -accessToken -refreshToken");

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findByIdAndDelete(userId).select(
    "-password -accessToken -refreshToken"
  );

  if (!user) {
    errorGenerate("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId)
    .select("-password -accessToken -refreshToken")
    .populate(basket.cartItems.productId);

  //Todo add user orders

  if (!user) {
    errorGenerate("User not found", 404);
  }
  res.status(200).json({
    status: "success",
    message: "User found successfully",
    data: user,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const pageNumber = parseInt(req.query.page || "1");
  const nPerPage = parseInt(req.query.limit || "10");

  const users = await User.find(
    { role: "USER" },
    "-password -refreshToken -accessToken"
  )
    .populate("basket.cartItems.productId")
    .sort({ _id: 1 })
    .skip((pageNumber - 1) * nPerPage)
    .limit(nPerPage);

  const totalUsers = await User.countDocuments({ role: "USER" });

  res.status(200).json({
    status: "success",
    data: users,
    currenPage: pageNumber,
    nextPage: pageNumber + 1,
    previousPage: pageNumber - 1,
    hasNextPage: nPerPage * pageNumber < totalUsers,
    hasPreviousPage: pageNumber > 1,
    lastPage: Math.ceil(totalUsers / nPerPage),
    total: totalUsers,
  });
});
