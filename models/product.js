const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot be more than 120 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      maxlength: [10, "Price cannot be more than 10 digits"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    photos: [
      {
        id: {
          type: String,
          required: [true, "Photo id is required"],
        },
        secure_url: {
          type: String,
          required: [true, "Photo secure_url is required"],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
