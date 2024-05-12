const { Router } = require("express");
const controller = require("../controllers/inventory");
const { verifyTokenAndAuthorizationManager } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationManager, controller.getAllProducts);
router.get("/queue", verifyTokenAndAuthorizationManager, controller.getAllQueues);

module.exports = router;
