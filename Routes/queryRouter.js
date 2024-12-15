const { Router } = require("express");
const controller = require("../controllers/queryController");

// создаем объект маршрутизатор
const router = Router();


// Маршрут для получения всех мастеров и их услуг
router.get('/master-services', controller.fetchMasterServices);
// Маршрут для получения чека по дате и времени
router.get("/receipt-by-datetime", controller.getReceiptByDateTime);
// Маршрут для получения расписания мастера на указанную дату
router.get("/master-schedule", controller.getMasterSchedule);
// экспортируем маршрутизатор на server
module.exports = router;