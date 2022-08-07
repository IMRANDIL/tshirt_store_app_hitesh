const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const {
  createOrder,
  getOneOrder,
  getAllOrders,
  adminOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/create").post(isLoggedIn, createOrder);
router.route("/all").get(isLoggedIn, getAllOrders);
router.route("/:orderId").get(isLoggedIn, getOneOrder);
// router.route("/all").get(isLoggedIn, getAllOrders); //beacuse of order it is giving error argument passed in must be a string..cast to object failed..

//admin routes...

router.route("/admin/orders").get(isLoggedIn, customRole("admin"), adminOrders);
router
  .route("/admin/update/:id")
  .put(isLoggedIn, customRole("admin"), updateOrder);
router
  .route("/admin/delete/:id")
  .delete(isLoggedIn, customRole("admin"), deleteOrder);

module.exports = router;
