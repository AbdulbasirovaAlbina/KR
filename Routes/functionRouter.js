const { Router } = require("express");
const controller = require("../controllers/functionController");

// создаем объект маршрутизатор
const router = Router();

// добавляем маршруты для пользовательской функции
router.get('/service-statistics', controller.getServiceStatistics);
// Маршрут для получения информации о мастерах с пустыми днями
router.get('/masters-empty-days', controller.getMastersWithEmptyDays);
// Маршрут для получения самой популярной услуги для клиентов
router.get('/most-used-service-for-clients', controller.getMostUsedServiceForClients);
// экспортируем маршрутизатор на server
module.exports = router;
