// импорт пула БД
const pool = require("../db");
const queries = require("../queries");

// Контроллер для получения всех клиентов и их заказов
const fetchClientOrders = async (req, res) => {
    try {
        const result = await pool.query(queries.getClientOrders); // Используем pool.query для выполнения запроса
        res.status(200).json(result.rows); // Отправляем результат в формате JSON
    } catch (error) {
        console.error('Ошибка при получении заказов клиентов:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении заказов клиентов.' });
    }
};

// Контроллер для получения всех мастеров и их услуг
const fetchMasterServices = async (req, res) => {
    try {
        const result = await pool.query(queries.getMasterServices);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении услуг мастеров:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении услуг мастеров.' });
    }
};

// Контроллер для получения расписания мастеров
const fetchMasterSchedule = async (req, res) => {
    try {
        const result = await pool.query(queries.getMasterSchedule);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении расписания мастеров:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении расписания мастеров.' });
    }
};

// экспортируем модуль как объект, в котором будет несколько функций
module.exports = {
  fetchClientOrders,
  fetchMasterServices,
  fetchMasterSchedule,
};
