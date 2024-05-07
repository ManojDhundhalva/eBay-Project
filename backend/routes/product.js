const { Router } = require("express");
const controller = require("../controllers/product");
const {
  verifyTokenAndAuthorizationUser,
} = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationUser, controller.getAllProducts);
router.get("/product-details", verifyTokenAndAuthorizationUser, controller.getProductsDetails);
router.post("/list-product", verifyTokenAndAuthorizationUser, controller.listProduct);

module.exports = router;
