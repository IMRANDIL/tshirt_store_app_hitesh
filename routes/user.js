const router = require("express").Router();
const {
  userSignUp,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  changePassword,
  updateUserProfile,
  adminAllUser,
} = require("../controllers/user");
const { authorizationProtect } = require("../middlewares/adminMiddleware");

const { isLoggedIn } = require("../middlewares/userMiddleware");

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userDashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").put(isLoggedIn, changePassword);
router.route("/profile/update").put(isLoggedIn, updateUserProfile);

//admin routes...

router
  .route("/admin/all-user")
  .get(isLoggedIn, authorizationProtect, adminAllUser);

module.exports = router;
