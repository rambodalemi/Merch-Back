const Validator = require("fastest-validator");

const v = new Validator();

const productOptionsSchema = {
  title: { type: "string", trim: true, min: 3, max: 100 },
  quantity: { type: "number", positive: true, integer: true },
  region: { type: "string", trim: true, min: 3, max: 100 },
  offPrice: { type: "number", min: 0 },
  price: { type: "number", min: 0 },
  discount: { type: "number", min: 0, max: 100 },
  countInStock: { type: "number", positive: true, integer: true },
  $$strict: true, // no additional properties allowed
};

const productSchema = {
  title: { type: "string", trim: true, min: 3, max: 100 },
  description: { type: "string", trim: true, min: 8 },
  slug: { type: "string", trim: true, min: 3, max: 30 },
  brand: { type: "string", trim: true, min: 3, max: 100 },
  countInStock: { type: "number", positive: true, integer: true },
  imageLink: { type: "string", trim: true, min: 10 },
  gallery: {
    type: "array",
    optional: true,
    max: 6,
    items: { type: "string", trim: true, min: 10 },
  },
  tags: {
    type: "array",
    min: 0,
    max: 20,
    items: { type: "string", trim: true, min: 3 },
  },

  category: { type: "string", trim: true, pattern: "^[a-fA-F0-9]{24}$" },
  offPrice: { type: "number", min: 0 },
  price: { type: "number", min: 0 },
  discount: { type: "number", min: 0, max: 100 },
  $$strict: true, // no additional properties allowed
};

exports.checkProduct = v.compile(productSchema);

exports.checkProductOptions = v.compile(productOptionsSchema);
