//admin middleware

// exports.authorizationProtect = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(401).send("Not authorized as an admin");
//   }
// };

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(401).send("Not authorized");
    }
  };
};
