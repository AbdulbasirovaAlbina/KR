const { Router } = require("express");
const controller = require("../controllers/procedureController");

const router = Router();

router.post('/add-schedule', controller.addMasterSchedule);
router.post('/add-master-service', controller.addMasterService);
router.post('/add-master', controller.addMaster);
module.exports = router;
