const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

const bigPromise = require("../middlewares/bigPromise");

exports.createOrder = bigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.Order;

  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
      user: req.user._id,
    });

    res.status(201).json({
      status: "success",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
