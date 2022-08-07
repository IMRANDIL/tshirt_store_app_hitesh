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
  } = req.body;

  if (
    !(
      shippingInfo &&
      orderItems &&
      paymentInfo &&
      taxAmount &&
      shippingAmount &&
      totalAmount
    )
  ) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

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

//get one order...

exports.getOneOrder = bigPromise(async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
