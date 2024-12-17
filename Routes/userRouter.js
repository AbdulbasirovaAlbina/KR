const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

// Маршрут для входа
router.post("/login", controller.getLogin);
router.post("/register", controller.registerUser);
// Маршрут для домашней страницы после логина
router.get("/", controller.getRedirectHome);

module.exports = router;
