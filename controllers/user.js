const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
// const CustomError = require("../utils/customError");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const { cookieToken } = require("../utils/cookieToken");
const mailHelper = require("../utils/emailHelper");

exports.userSignUp = bigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  const files = req.files;
  let result;

  //   if (!(name && email && password)) {
  //     next(new CustomError("Please provide all the fields", 400));
  //   }

  if (!(name && email && password && files)) {
    return res.status(400).send("Please provide all the fields");
  }

  try {
    if (req.files) {
      let file = req.files.photo;
      result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).send("User already exist");
    }

    const user = await User.create({
      name,
      email,
      password,
      photo: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
    });
    //send the cookie and token to the client....from utils folder.
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

exports.userLogin = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).send("Please provide all the fields");
  }

  try {
    //check if user exist in the database...

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    //check if password is correct...

    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid Credentials");
    }

    //send the cookie and token to the client....from utils folder.

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//user logout....

exports.userLogout = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

//password reset controller.....

exports.forgotPassword = bigPromise(async (req, res, next) => {
  const { email } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).send("User does not exist");
    }

    const forgotToken = user.generateForgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${forgotToken}`;

    const message = `Copy paste this link in our URL and hit enter \n\n ${myUrl}`;
    await mailHelper({
      email: user.email,
      subject: "Reset Password",
      message,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    res.status(500).send(error);
  }
});
