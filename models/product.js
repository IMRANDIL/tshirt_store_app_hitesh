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

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["shortSleeves", "longSleeves", "sweatShirts", "hoodies"],
        message:
          "Please select category only from- shortSleeves, longSleeves, sweatShirts and hoodies",
      },
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "User is required"],
        },
        name: {
          type: String,
          required: [true, "Name is required"],
        },
        rating: {
          type: Number,
          required: [true, "Rating is required"],
        },
        comment: {
          type: String,
          required: [true, "Comment is required"],
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
