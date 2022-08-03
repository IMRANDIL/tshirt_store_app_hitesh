const router = require("express").Router();
const {
  userSignUp,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
} = require("../controllers/user");

const { isLoggedIn } = require("../middlewares/userMiddleware");

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/dashboard").get(isLoggedIn, getLoggedInUserDetails);

module.exports = router;
