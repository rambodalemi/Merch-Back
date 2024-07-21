const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    category: { type: ObjectId, ref: "Category", required: true },
    imageLink: { type: String, required: true },
    gallery: {
      type: [String],
      default: undefined,
      validate: {
        validator: function (v) {
          return v && v.length <= 6;
        },
        message: "Gallery can be a maximum of 6 images",
      },
    },
    options: [{ type: ObjectId, ref: "ProductOption" }],
    price: { type: Number, required: true },
    offPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brand: { type: String, required: true },
    tags: [{ type: String }],
    rating: { type: Number, default: 0, required: true },
    countInStock: { type: Number, default: 0, required: true },
    likes: { type: [ObjectId], ref: "User", default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
