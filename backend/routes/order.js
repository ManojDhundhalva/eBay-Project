const { Router } = require("express");
const controller = require("../controllers/order");
const { verifyTokenAndAuthorizationUser } = require("../middlewares/verifyUser");

const router = Router();

router.post("/payment", verifyTokenAndAuthorizationUser, controller.makePayment);
router.post("/", verifyTokenAndAuthorizationUser, controller.makeOrder);
router.get("/", verifyTokenAndAuthorizationUser, controller.getAllOrders);

module.exports = router;
