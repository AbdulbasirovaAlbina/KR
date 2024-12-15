const { Router } = require("express");
const controller = require("../controllers/functionController");

// создаем объект маршрутизатор
const router = Router();

// добавляем маршруты для пользовательской функции
router.get("/service-statistics", controller.fetchServiceStatistics);
router.get("/service-statistics-by-date", controller.getServiceStatistics);
// экспортируем маршрутизатор на server
module.exports = router;
