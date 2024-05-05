const { Router } = require("express");
const controller = require("../controllers/login");

const router = Router();

router.post("/", controller.getAccount);

module.exports = router;
