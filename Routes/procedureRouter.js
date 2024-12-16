const { Router } = require("express");
const controller = require("../controllers/procedureController");

const router = Router();

router.post('/add-schedule', controller.addMasterSchedule);
router.post('/add-master-service', controller.addMasterService);

module.exports = router;
