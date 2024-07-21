const Validator = require("fastest-validator");

const v = new Validator();

const categorySchema = {
  title: { type: "string", trim: true, min: 3, max: 100 },
  englishTitle: { type: "string", trim: true, min: 3, max: 100 },
  description: { type: "string", trim: true, min: 3, max: 256 },
  type: { type: "enum", values: ["product", "post", "ticket"] },
  parent: {
    type: "string",
    optional: true,
    trim: true,
    pattern: "^[a-fA-F0-9]{24}$",
  },
  $$strict: true, // no additional properties allowed
};

const updateCategorySchema = {
  title: { type: "string", trim: true, min: 3, max: 100 },
  englishTitle: { type: "string", trim: true, min: 3, max: 100 },
  description: { type: "string", trim: true, min: 3, max: 256 },
  type: { type: "enum", values: ["product", "post", "ticket"] },
  $$strict: true, // no additional properties allowed
};

exports.checkCategory = v.compile(categorySchema);
exports.checkUpdateCategory = v.compile(updateCategorySchema);
