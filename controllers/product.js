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

//update admin product...

exports.updateProduct = bigPromise(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let imagesArray = [];
    if (req.files) {
      //destroy old images...

      for (let i = 0; i < product.photos.length; i++) {
        await cloudinary.v2.uploader.destroy(product.photos[i].id);
      }

      //upload new images...

      for (let i = 0; i < req.files.photos.length; i++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.photos[i].tempFilePath,
          {
            folder: "products", //folder name -> .env
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

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//delete a product...

exports.deleteProduct = bigPromise(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    //destroy old images...
    for (let i = 0; i < product.photos.length; i++) {
      await cloudinary.v2.uploader.destroy(product.photos[i].id);
    }
    //end of images...
    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//product reviews...

exports.addProductReviews = bigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    //check if user has already reviewed the product...

    const isUserReviewd = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (isUserReviewd) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.rating = Number(rating);
          review.comment = comment;
        }
      });
    }

    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
