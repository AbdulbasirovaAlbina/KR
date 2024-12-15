
const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");

const getServiceStatistics = async (req, res) => {
  const { startDate, endDate } = req.query;  // Дата начала и окончания периода передаются как параметры

  // Проверка наличия параметров в запросе
  if (!startDate || !endDate) {
      return res.status(400).json({ error: "Необходимо указать параметры 'startDate' и 'endDate'." });
  }

  try {
      // Выполнение запроса с параметрами startDate и endDate
      const result = await pool.query(queries.getServiceStatistics, [startDate, endDate]);
      
      // Если нет результатов, возвращаем ошибку
      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Нет данных для выбранного диапазона дат." });
      }

      // Возвращаем статистику
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Ошибка при получении статистики:', error.message);
      res.status(500).json({ error: 'Ошибка сервера при получении статистики.' });
  }
};
const getMastersWithEmptyDays = async (req, res) => {
    const { startDate, endDate } = req.query;  // Параметры для диапазона дат
    
    // Проверка наличия параметров
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Необходимо указать параметры 'startDate' и 'endDate'." });
    }
  
    try {
      // Выполнение SQL-запроса с параметрами
      const result = await pool.query(queries.getMastersWithEmptyDays, [startDate, endDate]);
      
      // Проверка, есть ли результаты
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Нет данных для указанного диапазона дат." });
      }
  
      // Отправка результата в формате JSON
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении данных о мастерах:", error.message);
      res.status(500).json({ error: "Ошибка сервера при получении данных о мастерах." });
    }
  };

  // Контроллер для получения самой популярной услуги для клиентов
const getMostUsedServiceForClients = async (req, res) => {
    const { startDate, endDate } = req.query;  // Получаем параметры startDate и endDate
  
    // Проверка наличия параметров startDate и endDate
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Необходимо указать параметры 'startDate' и 'endDate'." });
    }
  
    try {
      // Выполнение запроса с параметрами
      const result = await pool.query(queries.getMostUsedServiceForClients, [startDate, endDate]);
  
      // Возвращаем результаты в формате JSON
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении самых популярных услуг:", error.message);
      res.status(500).json({ error: "Ошибка сервера при получении данных." });
    }
  };
  
module.exports = {
getServiceStatistics,
getMastersWithEmptyDays,
getMostUsedServiceForClients
};