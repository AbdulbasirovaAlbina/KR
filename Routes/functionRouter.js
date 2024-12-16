const { Router } = require("express");
const controller = require("../controllers/functionController");

// создаем объект маршрутизатор
const router = Router();

// добавляем маршруты для пользовательской функции
router.get('/service-statistics', controller.getServiceStatistics);
// Маршрут для получения информации о мастерах с пустыми днями
router.get('/masters-empty-days', controller.getMastersWithEmptyDays);
router.get('/free-slots', controller.getFreeSlots);
// добавляем маршрут для популярной услуги клиента
router.get('/most-used-service', controller.getMostUsedService); 
// экспортируем маршрутизатор на server
module.exports = router;
