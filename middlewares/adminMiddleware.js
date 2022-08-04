//admin middleware

exports.authorizationProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as an Admin");
  }
};
