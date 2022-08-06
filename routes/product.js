const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const {
  createProduct,
  getAllProducts,
  getAllAdminProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

//admin route..

router
  .route("/admin/create")
  .post(isLoggedIn, customRole("admin"), createProduct);

router
  .route("/admin/all")
  .get(isLoggedIn, customRole("admin"), getAllAdminProducts);

router
  .route("/admin/update/:id")
  .put(isLoggedIn, customRole("admin"), updateProduct);

router
  .route("/admin/delete/:id")
  .delete(isLoggedIn, customRole("admin"), deleteProduct);
//public route...

router.route("/").get(getAllProducts);
router.route("/:id").get(getProductById);

module.exports = router;
