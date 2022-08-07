const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const { createOrder, getOneOrder } = require("../controllers/orderController");

router.route("/create").post(isLoggedIn, createOrder);
router.route("/:orderId").get(isLoggedIn, getOneOrder);

module.exports = router;
