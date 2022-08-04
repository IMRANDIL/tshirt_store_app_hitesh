const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");

router.route("/create").post();

module.exports = router;
