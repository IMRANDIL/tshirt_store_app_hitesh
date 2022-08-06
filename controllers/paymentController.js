const bigPromise = require("../middlewares/bigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//payment controller...

exports.sendStripeKeys = bigPromise(async (req, res, next) => {
  const stripePublicKey = process.env.STRIPE_API_KEY;

  res.status(200).json({
    success: true,
    stripePublicKey,
  });
});

//create payment intent...

exports.createPaymentIntent = bigPromise(async (req, res, next) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "INR",
    });

    res.status(200).json({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
