const router = require("express").Router();
const {
  userSignUp,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);

module.exports = router;
