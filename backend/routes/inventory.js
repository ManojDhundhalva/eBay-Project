const { Router } = require("express");
const controller = require("../controllers/inventory");
const { verifyTokenAndAuthorizationManager } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationManager, controller.getAllProducts);
router.get("/queue", verifyTokenAndAuthorizationManager, controller.getAllQueues);
router.get("/received-queue", verifyTokenAndAuthorizationManager, controller.getAllReceivedQueues);
router.post("/order-shipped", verifyTokenAndAuthorizationManager, controller.makeOrderShipped);
router.post("/order-out-for-delivery", verifyTokenAndAuthorizationManager, controller.makeOrderOutForDelivery);

module.exports = router;
