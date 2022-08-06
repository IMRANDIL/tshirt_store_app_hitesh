const bigPromise = require("../middlewares/bigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require("razorpay");
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

//SEND RAZOR PAY KEY...

exports.sendRazorPayKey = bigPromise(async (req, res, next) => {
  res.status(200).json({
    razorPayKey: process.env.RAZOR_PAY_API_KEY,
  });
});

//razor pay payment integration...

exports.captureRazorPayment = bigPromise(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_API_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET,
  });

  const options = {
    amount: req.body.amount, //amount in the smallest currency unit..
    currency: "INR",
  };
  try {
    const myorder = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order: myorder,
      amount: req.body.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
