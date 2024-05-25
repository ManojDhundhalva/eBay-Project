const { Router } = require("express");
const controller = require("../controllers/database");
const { verifyTokenAndAuthorizationUser } = require("../middlewares/verifyUser");

const router = Router();

router.get("/table", verifyTokenAndAuthorizationUser, controller.getAllTables);
router.get("/table-data", verifyTokenAndAuthorizationUser, controller.getTableData);

module.exports = router;
