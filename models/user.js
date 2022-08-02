const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
        // required: true,
      },
      secure_url: {
        type: String,
        // required: true,
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

//verify password....returns boolean

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

//generate forgot password token(string)...just send the random string to the user

userSchema.methods.generateForgotPasswordToken = function () {
  //generate a long random string
  const user = this;
  const token = crypto.randomBytes(20).toString("hex");
  //getting a hash - make sure to get a hash on backend
  user.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  //time for token...
  user.forgotPasswordExpiry = Date.now() + 1000 * 20 * 60;

  return token;
};

module.exports = mongoose.model("User", userSchema);
