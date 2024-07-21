const { catchAsync } = require("../utils/catchAsync");
const { errorGenerate } = require("../utils/errorGenerate");
const User = require("../models/user");
const { ROLES } = require("../utils/constants");

exports.createAdmin = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const newAdmin = await User.findById(id);

  if (!newAdmin) {
    errorGenerate("user not find", 404);
  }

  if (newAdmin && newAdmin.role === "ADMIN") {
    errorGenerate("Admin already exists", 400);
  }

  newAdmin.role = ROLES.ADMIN;

  await newAdmin.save();

  res.status(201).json({
    status: "success",
    message: "Admin created successfully",
  });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user || user.role !== "ADMIN") {
    errorGenerate("user not find or the role is not admin", 400);
  }

  user.role = ROLES.USER;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Admin deleted successfully",
  });
});

exports.getAdmins = catchAsync(async (req, res, next) => {
  const pageNumber = parseInt(req.query.page || "1");
  const nPerPage = parseInt(req.query.limit || "10");

  const admins = await User.find({ role: "ADMIN" })
    .skip((pageNumber - 1) * nPerPage)
    .limit(nPerPage);

  const totalAdmins = await User.countDocuments({ role: "ADMIN" });

  res.status(200).json({
    status: "success",
    data: admins,
    currenPage: pageNumber,
    nextPage: pageNumber + 1,
    previousPage: pageNumber - 1,
    hasNextPage: nPerPage * pageNumber < totalAdmins,
    hasPreviousPage: pageNumber > 1,
    lastPage: Math.ceil(totalAdmins / nPerPage),
    total: totalAdmins,
  });
});

exports.getAdmin = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const admin = await User.findById(id)

  if (!admin || admin.role !== "ADMIN") {
    return errorGenerate("Admin not find", 400);
  }
  res.status(200).json({
    status: "success",
    data: admin,
  });
});
