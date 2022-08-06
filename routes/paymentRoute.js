const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const {
  createPaymentIntent,
  sendRazorPayKey,
  sendStripeKeys,
  captureRazorPayment,
} = require("../controllers/paymentController");

router.route("/stripekey").get(isLoggedIn, sendStripeKeys);
router.route("/razorkey").get(isLoggedIn, sendRazorPayKey);
router.route("/stripe/payment").post(isLoggedIn, createPaymentIntent);
router.route("/razor/payment").post(isLoggedIn, captureRazorPayment);

module.exports = router;
