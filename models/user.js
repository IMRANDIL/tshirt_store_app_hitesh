const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

//encrypt password before saving....

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

//verify password....

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

module.exports = mongoose.model("User", userSchema);
