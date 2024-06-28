const { Router } = require("express");
const controller = require("../controllers/veifyEmail");

const router = Router();

router.post("/", controller.sendEmail);

module.exports = router;
