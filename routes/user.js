const router = require("express").Router();
const {
  userSignUp,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  changePassword,
} = require("../controllers/user");

const { isLoggedIn } = require("../middlewares/userMiddleware");

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userDashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").put(isLoggedIn, changePassword);

module.exports = router;
