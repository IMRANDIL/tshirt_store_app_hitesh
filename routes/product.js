const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const { createProduct, getAllProducts } = require("../controllers/product");

//admin route..

router
  .route("/admin/create")
  .post(isLoggedIn, customRole("admin"), createProduct);

//public route...

router.route("/").get(getAllProducts);

module.exports = router;
