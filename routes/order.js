const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const { createOrder } = require("../controllers/orderController");

router.route("/create").post(isLoggedIn, createOrder);

module.exports = router;
