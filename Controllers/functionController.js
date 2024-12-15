
const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");


// Контроллер для получения статистики по услугам за период
const fetchServiceStatistics = (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Необходимо указать обе даты (startDate и endDate)." });
  }

  pool.query(
    queries.getServiceStatistics,
    [startDate, endDate],
    (error, results) => {
      if (error) {
        console.error("Ошибка при получении статистики:", error.message);
        return res.status(500).json({ error: "Ошибка сервера при получении статистики." });
      }
      res.status(200).json(results.rows);
    }
  );
};
const getServiceStatistics = (req, res) => {
  const { startDate, endDate } = req.query;

  // Проверяем, что оба параметра переданы
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Параметры startDate и endDate обязательны" });
  }

  pool.query(queries.getServiceStatisticsByDate, [startDate, endDate], (error, results) => {
    if (error) {
      console.error("Ошибка при получении статистики по услугам:", error.message);
      return res.status(500).json({ error: "Ошибка при получении статистики по услугам" });
    }
    res.status(200).json(results.rows);
  });
};


module.exports = {
  fetchServiceStatistics,
  getServiceStatistics
};