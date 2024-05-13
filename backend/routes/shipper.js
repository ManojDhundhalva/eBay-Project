const { Router } = require("express");
const controller = require("../controllers/shipper");
const { verifyTokenAndAuthorizationShipper } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationShipper, controller.getAllProducts);
router.post("/", verifyTokenAndAuthorizationShipper, controller.deliverAllProducts);

module.exports = router;
