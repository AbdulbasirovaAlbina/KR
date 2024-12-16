const { Router } = require("express");
const controller = require("../controllers/procedureController");

const router = Router();

router.post("/add-schedule", controller.addMasterSchedule);


module.exports = router;
