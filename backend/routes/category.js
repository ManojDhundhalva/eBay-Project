const { Router } = require("express");
const controller = require("../controllers/category");
const { verifyTokenAndAuthorizationUser } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationUser, controller.getAllCategories);

module.exports = router;
