const { Router } = require("express");
const controller = require("../controllers/register");

const router = Router();

router.post("/", controller.createAccount);

module.exports = router;
