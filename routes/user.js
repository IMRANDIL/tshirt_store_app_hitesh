const router = require("express").Router();
const { userSignUp, userLogin } = require("../controllers/user");

router.route("/signup").post(userSignUp);
router.route("/login").post(userLogin);

module.exports = router;
