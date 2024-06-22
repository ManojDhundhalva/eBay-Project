const { Router } = require("express");
const controller = require("../controllers/product");
const {
  verifyTokenAndAuthorizationUser,
} = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationUser, controller.getAllProducts);
router.get("/product-details", verifyTokenAndAuthorizationUser, controller.getProductsDetails);
router.post("/list-product", verifyTokenAndAuthorizationUser, controller.listProduct);
router.post("/watch-product", verifyTokenAndAuthorizationUser, controller.watchProduct);
router.post("/review-product", verifyTokenAndAuthorizationUser, controller.reviewTheProduct);
router.get("/most-watched", verifyTokenAndAuthorizationUser, controller.getMostWatchedProducts);
router.get("/most-rated", verifyTokenAndAuthorizationUser, controller.getMostRatedProducts);
router.get("/most-popular-seller", verifyTokenAndAuthorizationUser, controller.getMostPopularSellerProducts);

module.exports = router;
