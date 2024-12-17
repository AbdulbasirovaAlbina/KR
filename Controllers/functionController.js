
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


  const getFreeSlots = async (req, res) => {
    const { lastName, firstName, middleName, serviceName, date } = req.body;
  
    // Проверка наличия всех параметров
    if (!lastName || !firstName || !middleName || !serviceName || !date) {
      return res.status(400).json({ error: "Необходимо указать все параметры: lastName, firstName, middleName, serviceName, date." });
    }
  
    try {
      // Запрос для получения свободных слотов
      const result = await pool.query(queries.getFreeSlotsForService, [
        lastName,
        firstName,
        middleName,
        serviceName,
        date,
      ]);
  
      // Если нет свободных окон, возвращаем ошибку с описанием
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Свободных окон для указанной услуги не найдено." });
      }
  
      res.status(200).json(result.rows);
  
    } catch (error) {
      console.error("Ошибка при получении свободных окон:", error.message);
  
      // Обработка ошибок на основе сообщения ошибки
      if (error.message.includes('Услуга не найдена')) {
        return res.status(404).json({ error: error.message });
      }
  
      if (error.message.includes('Мастер не найден')) {
        return res.status(404).json({ error: error.message });
      }
  
      // Обработка других типов ошибок
      res.status(500).json({ error: "Ошибка сервера при получении свободных окон." });
    }
  };
  

  const getMostUsedService = async (req, res) => {
    const { lastName, firstName, startDate, endDate } = req.body; // Параметры приходят из body запроса
  
    // Проверка наличия всех параметров
    if (!lastName || !firstName || !startDate || !endDate) {
      return res.status(400).json({
        error: "Необходимо указать все параметры: lastName, firstName, startDate, endDate.",
      });
    }
  
    try {
      // Выполнение SQL-запроса с параметрами
      const result = await pool.query(queries.getMostUsedServiceForClient, [
        lastName,
        firstName,
        startDate,
        endDate,
      ]);
  
      // Проверка, если нет данных
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Нет данных для указанного клиента." });
      }
  
      // Отправка результата
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении данных о популярной услуге:", error.message);
      res.status(500).json({ error: "Ошибка сервера при получении данных." });
    }
  };
  
  const getClientServiceHistory = async (req, res) => {
    const { lastName, firstName, phone } = req.body; // Параметры приходят через тело запроса
  
    // Проверка наличия всех параметров
    if (!lastName || !firstName || !phone) {
      return res.status(400).json({ error: "Необходимо указать все параметры: lastName, firstName, phone." });
    }
  
    try {
      // Запрос для получения истории услуг клиента
      const result = await pool.query(queries.historyClient, [lastName, firstName, phone]);
  
      // Если данных нет
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Услуги для этого клиента не найдены." });
      }
  
      // Форматируем дату и время для каждого результата
      const formattedResults = result.rows.map(row => {
        return {
          "Дата записи": row["Дата записи"].toISOString().split('T')[0], // Получаем только дату без времени
          "Время начала": row["Время начала"].toString(), // Форматируем время как строку
          "Время окончания": row["Время окончания"].toString(), // Форматируем время как строку
          "Услуга": row["Услуга"],
          "Мастер": row["Мастер"]
        };
      });
  
      // Возвращаем отформатированные результаты
      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Ошибка при получении истории услуг:", error.message);
      if (error.message.includes('Клиент с такими данными не найден:')) {
        return res.status(404).json({ error: "Клиент с такими данными не найден" });
      } else {
      return res.status(500).json({ error: "Произошла ошибка при получении данных." });}
    }
  };
  
module.exports = {
getServiceStatistics,
getMostUsedService,
getMastersWithEmptyDays,
getFreeSlots,
getClientServiceHistory
};