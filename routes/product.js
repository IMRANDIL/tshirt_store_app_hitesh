const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddleware");
const { customRole } = require("../middlewares/adminMiddleware");
const { createProduct, getAllProducts } = require("../controllers/product");

router.route("/create").post(isLoggedIn, customRole("admin"), createProduct);
router.route("/").get(getAllProducts);

module.exports = router;
