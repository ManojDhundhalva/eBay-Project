const { Router } = require("express");
const controller = require("../controllers/bankDetails");
const {
    verifyTokenAndAuthorizationUser,
} = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorizationUser, controller.getBankAccount);
router.post("/", verifyTokenAndAuthorizationUser, controller.updateBankAccount);

module.exports = router;
