const { Router } = require("express");
const controller = require("../controllers/queryController");

// создаем объект маршрутизатор
const router = Router();

// добавляем маршруты для запросов
router.get("/", controller.getCooperator); 
router.get("/:id", controller.getCooperatorById);
router.post("/", controller.addCooperator);
router.put("/:id", controller.updateCooperator);
router.delete("/:id", controller.removeCooperator);

// экспортируем маршрутизатор на server
module.exports = router;
