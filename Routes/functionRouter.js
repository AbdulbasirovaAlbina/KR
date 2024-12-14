const { Router } = require("express");
const controller = require("../controllers/functionController");

// создаем объект маршрутизатор
const router = Router();

// добавляем маршруты для пользовательской функции
router.get("/", controller.func_SelectCooperator);
router.get("/:name_department", controller.func_CountCooperator);
router.post("/", controller.func_InsertCooperator);

// экспортируем маршрутизатор на server
module.exports = router;
