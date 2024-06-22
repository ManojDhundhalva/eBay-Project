const { Router } = require("express");
const controller = require("../controllers/category");
const { verifyTokenAndAuthorizationUser } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationUser, controller.getAllCategories);
router.get("/category-only", verifyTokenAndAuthorizationUser, controller.getCategoriesOnly);
router.post("/filter-products", verifyTokenAndAuthorizationUser, controller.getFilteredProducts);
router.post("/filter-seller-products", verifyTokenAndAuthorizationUser, controller.getFilteredSellerProducts);

module.exports = router;
