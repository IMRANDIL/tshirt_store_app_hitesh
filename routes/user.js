const router = require("express").Router();
const { userSignUp, userLogin, userLogout } = require("../controllers/user");

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);

module.exports = router;
