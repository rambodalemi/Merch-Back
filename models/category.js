const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new Schema(
  {
    title: { type: String, trim: true, required: true, unique: true },
    englishTitle: { type: String, trim: true, required: true, unique: true },
    description: { type: String, trim: true, required: true },
    type: {
      type: String,
      enum: ["product", "post", "ticket"],
      default: "product",
      required: true,
    },
    parentId: {
      type: ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
