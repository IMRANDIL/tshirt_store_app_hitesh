const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const {
  createOrder,
  getOneOrder,
  getAllOrders,
  adminOrders,
} = require("../controllers/orderController");

router.route("/create").post(isLoggedIn, createOrder);
router.route("/all").get(isLoggedIn, getAllOrders);
router.route("/:orderId").get(isLoggedIn, getOneOrder);
// router.route("/all").get(isLoggedIn, getAllOrders); //beacuse of order it is giving error argument passed in must be a string..cast to object failed..

//admin routes...

router.route("/admin/orders").get(isLoggedIn, customRole("admin"), adminOrders);

module.exports = router;
