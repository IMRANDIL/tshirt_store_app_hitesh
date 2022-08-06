const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary");

const WhereClause = require("../utils/whereClause");

exports.createProduct = bigPromise(async (req, res, next) => {
  const { name, price, description } = req.body;

  if (!(name && price && description)) {
    return res.status(400).json({
      message: "Please provide all the required fields",
    });
  }

  //images...

  let imagesArray = [];

  if (!req.files) {
    return res.status(400).json({
      message: "Images are required",
    });
  }

  if (req.files) {
    for (let i = 0; i < req.files.photos.length; i++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "products",
        }
      );

      imagesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imagesArray;
  //end of images...

  req.body.user = req.user._id;

  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get all product...based on where clause class...

exports.getAllProducts = bigPromise(async (req, res, next) => {
  const resultPerPage = 6;

  const totalCountProducts = await Product.countDocuments();

  let products = new WhereClause(Product.find(), req.query)
    .search()
    .filterProduct();

  const filteredProductsCount = products.length;

  products.pager(resultPerPage);
  products = await products.base;

  res.status(200).json({
    success: true,
    products,
    filteredProductsCount,
    totalCountProducts,
  });
});

//get all admin products....

exports.getAllAdminProducts = bigPromise(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return res.status(404).json({
      message: "No products found",
    });
  }

  res.status(200).json({
    success: true,
    products,
  });
});

//get product by id...

exports.getProductById = bigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});
