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
  managerAllUser,
} = require("../controllers/user");
const { customRole } = require("../middlewares/adminMiddleware");

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
  .get(isLoggedIn, customRole("admin"), adminAllUser);

//manager routes...

router
  .route("/manager/all-user")
  .get(isLoggedIn, customRole("manager"), managerAllUser);

module.exports = router;
