const { Router } = require("express");
const controller = require("../controllers/procedureController");

const router = Router();

router.post('/add-schedule', controller.addMasterSchedule);
router.post('/add-master-service', controller.addMasterService);
router.post('/add-master', controller.addMaster);
router.post('/add-service', controller.addService);  
router.post('/add-client', controller.addClient);  
router.post('/add-schedule', controller.addSchedule);
router.post('/add-client-order-and-schedule', controller.addClientOrderAndSchedule);
router.put('/update-client-order', controller.updateClientOrder);
router.put('/update-client', controller.updateClientData);
router.put('/update-master', controller.updateMasterData);
module.exports = router;
