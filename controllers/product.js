const Product = require("../models/product");
const { catchAsync } = require("../utils/catchAsync");
const { checkProduct } = require("../validators/product");

exports.createProduct = catchAsync(async (req, res, next) => {
  const checkData = await checkProduct({ ...req.body });

  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      errors: checkData,
    });
  }

  const newProduct = await Product.create({ ...req.body });

  if (!newProduct) {
    return res.status(400).json({
      status: "error",
      message: "Product creation failed. Try again",
    });
  }

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const checkData = await checkProduct({ ...req.body });

  if (checkData !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      errors: checkData,
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found..",
    });
  }

  await product.updateOne({ $set: { ...req.body } }, { new: true });

  const updatedProduct = await Product.findById(id);

  return res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  const relatedProducts = await Product.find({
    category: product.category,
  }).limit(10);

  res.status(200).json({
    status: "success",
    message: "Product find successfully",
    data: product,
    relatedProducts,
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const query = req.query;
  //?page=5&limit=10&price=500/1000
  const pageNumber = parseInt(query.page || "1");
  const nPerPage = parseInt(query.limit || "6");

  let filters = {};
  if (query.category) {
    filters.category = { $in: query.category.split("/") };
  }
  if (query.tags) {
    filters.tags = { $in: query.tags.split("/") };
  }
  if (query.brand) {
    filters.brand = { $in: query.brand.split("/") };
  }
  if (query.color) {
    filters.color = { $in: query.color.split("/") };
  }
  if (query.price) {
    let min = query.price.split("/")[0].replace(/^\D+/g, "");
    let max = query.price.split("/")[1].replace(/^\D+/g, "");
    filters.price = { $gt: min, $lte: max };
  }

  let sort = { _id: -1 };

  if (query.sort) {
    if (query.sort === "latest") {
      sort = { createdAt: -1 };
    }
    if (query.sort === "price-low-to-high") {
      sort = { price: 1 };
    }
    if (query.sort === "price-high-to-low") {
      sort = { price: -1 };
    }
  }

  if (query.search) {
    filters.title = {
      $regex: new RegExp(".*" + query.search.trim() + ".*", "ig"),
    };
    filters.description = {
      $regex: new RegExp(".*" + query.search.trim() + ".*", "ig"),
    };
  }

  const products = await Product.find(filters)
    .sort(sort)
    .skip((pageNumber - 1) * nPerPage)
    .limit(nPerPage);

  const totalProducts = await Product.countDocuments(filters);

  res.status(200).json({
    status: "success",
    data: products,
    total: totalProducts,
    currentPage: pageNumber,
    nextPage: pageNumber + 1,
    previousPage: pageNumber - 1,
    hasNextPage: nPerPage * pageNumber < totalProducts,
    hasPreviousPage: pageNumber > 1,
    lastPage: Math.ceil(totalProducts / nPerPage),
  });
});
