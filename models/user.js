const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [50, "Name can't be more than 50 characters"],
      minlength: [3, "Name can't be less than 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Invalid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password can't be less than 5 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
