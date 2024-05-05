const { Router } = require("express");
const controller = require("../controllers/profile");
const {
  verifyTokenAndAuthorizationGeneral,
} = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationGeneral, controller.getProfile);
router.post("/", verifyTokenAndAuthorizationGeneral, controller.updateProfile);

module.exports = router;
