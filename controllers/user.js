const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
const crypto = require("crypto");
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

//forgot password controller.....

exports.forgotPassword = bigPromise(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Please provide email");
  }

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
    )}/api/v1/user/password/reset/${forgotToken}`;

    const message = `Copy paste this link in our URL and hit enter \n\n ${myUrl}`;
    await mailHelper({
      email: user.email,
      subject: "Reset Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    res.status(500).send(error);
  }
});

//reset password controller.....

exports.resetPassword = bigPromise(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.token;

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  try {
    const userCheck = await User.findOne({
      forgotPasswordToken: encryptedToken,
      forgotPasswordExpiry: {
        $gt: Date.now(),
      },
    });

    if (!userCheck) {
      return res.status(400).send("Invalid Token or Expired");
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .send("Password and Confirm Password does not match");
    }

    userCheck.password = password;
    userCheck.forgotPasswordToken = undefined;
    userCheck.forgotPasswordExpiry = undefined;
    await userCheck.save();
    //send a jwt token....

    cookieToken(userCheck, res);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//get logged in user details...

exports.getLoggedInUserDetails = bigPromise(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//change the password....user know the old password..

exports.changePassword = bigPromise(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword && newPassword)) {
    return res.status(400).send("Please provide all the fields");
  }

  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    const isPasswordCorrect = await user.verifyPassword(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(400).send("Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();
    //update the token now...
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//user profile update.....

exports.updateUserProfile = bigPromise(async (req, res, next) => {
  try {
    const newData = {
      name: req.body.name,
    };

    if (req.files) {
      let file = req.files.photo;
      const requiredUser = await User.findById(req.user._id);
      const photoId = requiredUser.photo.id;
      //destroyed the photo on cloudinary..
      const resp = await cloudinary.v2.uploader.destroy(photoId);

      //upload the photo now...

      const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });

      newData.photo = {
        id: result.public_id,
        url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(req.user._id, newData, {
      new: true,
      runValidators: true,
    });

    //send the response now...

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
