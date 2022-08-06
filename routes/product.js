const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const {
  createProduct,
  getAllProducts,
  getAllAdminProducts,
} = require("../controllers/product");

//admin route..

router
  .route("/admin/create")
  .post(isLoggedIn, customRole("admin"), createProduct);

router
  .route("/admin/all")
  .get(isLoggedIn, customRole("admin"), getAllAdminProducts);

//public route...

router.route("/").get(getAllProducts);

module.exports = router;
