const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
// const CustomError = require("../utils/customError");

const { cookieToken } = require("../utils/cookieToken");

exports.userSignUp = bigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  //   if (!(name && email && password)) {
  //     next(new CustomError("Please provide all the fields", 400));
  //   }

  if (!(name && email && password)) {
    return res.status(400).send("Please provide all the fields");
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res.status(400).send("User already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  //send the cookie and token to the client....from utils folder.
  cookieToken(user, res);
});

exports.userLogin = bigPromise(async (req, res, next) => {});
