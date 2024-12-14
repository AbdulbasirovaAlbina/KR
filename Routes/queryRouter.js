const { Router } = require("express");
const controller = require("../controllers/queryController");

// создаем объект маршрутизатор
const router = Router();

// Маршрут для получения всех клиентов и их заказов
router.get('/client-orders', controller.fetchClientOrders);

// Маршрут для получения всех мастеров и их услуг
router.get('/master-services', controller.fetchMasterServices);

// Маршрут для получения расписания мастеров
router.get('/master-schedule', controller.fetchMasterSchedule);
// экспортируем маршрутизатор на server
module.exports = router;





