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
    const order = await Order.findById(orderId).populate("user", "name email");
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

//all orders of a user..logged in user...

exports.getAllOrders = bigPromise(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  });

  if (!orders) {
    return res.status(404).json({
      message: "No Order found",
    });
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

//get all orders for admin...

exports.adminOrders = bigPromise(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders) {
    return res.status(404).json({
      message: "No order found",
    });
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

//update the order...admin...related...

exports.updateOrder = bigPromise(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.deliveredAt === "Delivered") {
      return res.status(400).json({
        message: "Product already delivered",
      });
    }

    order.orderStatus = req.body.orderStatus;

    //apply the updatestock method...

    order.orderItems.forEach(async (item) => {
      await updateProductStock(item.product, item.quantity);
    });

    await order.save();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);

  if (product.stock && product.stock > quantity) {
    product.stock = product.stock - quantity;
  }

  await product.save({ validateBeforeSave: false });
}
