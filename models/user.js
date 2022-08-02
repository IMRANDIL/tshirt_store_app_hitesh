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
      minlength: [6, "Password can't be less than 6 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    forgotPasswordToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
