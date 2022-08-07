const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const {
  createOrder,
  getOneOrder,
  getAllOrders,
} = require("../controllers/orderController");

router.route("/create").post(isLoggedIn, createOrder);
router.route("/all").get(isLoggedIn, getAllOrders);
router.route("/:orderId").get(isLoggedIn, getOneOrder);
// router.route("/all").get(isLoggedIn, getAllOrders); //beacuse of order it is giving error argument passed in must be a string..cast to object failed..

module.exports = router;
