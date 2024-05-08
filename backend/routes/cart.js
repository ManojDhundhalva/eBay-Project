const { Router } = require("express");
const controller = require("../controllers/cart");
const { verifyTokenAndAuthorizationUser } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationUser, controller.getCart);
router.post("/", verifyTokenAndAuthorizationUser, controller.addToCart);
router.delete("/", verifyTokenAndAuthorizationUser, controller.deleteFromCart);

module.exports = router;
