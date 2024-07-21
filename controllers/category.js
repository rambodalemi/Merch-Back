const { catchAsync } = require("../utils/catchAsync");
const {
  checkCategory,
  checkUpdateCategory,
} = require("../validators/category");
const Category = require("../models/category");

exports.addNewCategory = catchAsync(async (req, res, next) => {
  const { title, englishTitle, description, type, parent } = req.body;

  const checkData = await checkCategory({
    title,
    englishTitle,
    description,
    type,
    parent,
  });

  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      meaage: "Invalid data",
      checkData,
    });
  }

  const category = await Category.findOne({ englishTitle });

  if (category) {
    return res.status(400).json({
      status: "error",
      message: "Category already exists",
    });
  }

  const newCategory = await Category.create({
    title,
    englishTitle,
    description,
    type,
    parent,
  });

  if (!newCategory) {
    return res.status(400).json({
      status: "error",
      message: "Something went wrong.Try again...",
    });
  }

  return res.status(201).json({
    status: "success",
    message: "Category created successfully",
  });
});

exports.getListOfCategories = catchAsync(async (req, res, next) => {
  const query = req.query;
  const categories = await Category.find(query);

  if (!categories) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: categories,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { title, englishTitle, type, description } = req.body;

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  const checkData = await checkUpdateCategory({
    title,
    englishTitle,
    description,
    type,
  });

  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      meaage: "Invalid data",
      checkData,
    });
  }

  const updateReusult = await Category.updateOne(
    { _id: id },
    {
      $set: { title, englishTitle, type, description },
    }
  );

  if (updateReusult.modifiedCount == 0) {
    return res.status(400).json({
      status: "error",
      meaage: "Update do not occured",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
  });
});

exports.removeCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({
      status: "error",
      meaage: "Category not found",
    });
  }

  const deleteResult = await Category.deleteMany({
    $or: [{ _id: category._id }, { parentId: category._id }],
  });

  if (deleteResult.deletedCount == 0) {
    return res.status(400).json({
      status: "error",
      meaage: "Deletion of category do not occured",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
  });
});

exports.getCategoryById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      status: "error",
      meaage: "Category not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: category,
  });
});
