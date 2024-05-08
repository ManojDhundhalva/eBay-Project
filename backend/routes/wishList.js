const { Router } = require("express");
const controller = require("../controllers/wishList");
const { verifyTokenAndAuthorizationUser } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationUser, controller.getWishList);
router.post("/", verifyTokenAndAuthorizationUser, controller.addToWishList);
router.delete("/", verifyTokenAndAuthorizationUser, controller.deleteFromWishList);

module.exports = router;
