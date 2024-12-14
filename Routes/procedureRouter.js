const { Router } = require("express");
const controller = require("../controllers/procedureController");

const router = Router();

router.post("/", controller.validateCooperatorData, controller.procAddCooperator);
router.put("/:percent", controller.procUpdateSalary);
router.delete("/", controller.procRemoveCooperator);

module.exports = router;
