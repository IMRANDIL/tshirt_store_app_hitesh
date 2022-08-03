const User = require("../models/user");
const bigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = bigPromise(async (req, res, next) => {
  const token =
    req.cookies.token ||
    req.header["Authorization"].replace("Bearer ", "") ||
    req.body.token;

  if (!token) {
    return res.status(401).send("Unauthorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //decode the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).send("Unauthorized, Invalid token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
