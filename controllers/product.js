const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary");

exports.createProduct = bigPromise(async (req, res, next) => {
  //images...

  let imagesArray = [];

  if (!req.files) {
    return res.status(401).json({
      message: "Images are required",
    });
  }

  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
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
});
