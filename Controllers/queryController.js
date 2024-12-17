// импорт пула БД
const pool = require("../db");
const queries = require("../queries");


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

const getReceiptByDateTime = (req, res) => {
  const { Дата, Время } = req.body;  // Получаем параметры Дата и Время из тела запроса

  // Проверка наличия параметров
  if (!Дата || !Время) {
    return res.status(400).json({ error: "Необходимо указать параметры 'Дата' и 'Время'." });
  }

  // Объединяем Дата и Время в одну строку (например: "2024-12-17 10:00:00")
  const dateTime = `${Дата} ${Время}`;

  pool.query(
    queries.getReceiptByDateTime,  // Используем запрос из queries.js
    [dateTime],  // Передаем объединенную строку
    (error, results) => {
      if (error) {
        console.error("Ошибка при получении данных о чеке:", error.message);
        return res.status(500).json({ error: "Ошибка сервера при получении данных о чеке." });
      }

      // Если нет результатов, возвращаем ошибку
      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Чек с указанной датой и временем не найден." });
      }

      // Возвращаем данные о чеке
      res.status(200).json(results.rows);
    }
  );
};



  
  const getMasterSchedule = (req, res) => {
    const { date } = req.query;
  
    // Проверка наличия даты в запросе
    if (!date) {
      return res.status(400).json({ error: "Необходимо указать дату в параметре 'date'." });
    }
  
    pool.query(queries.getMasterScheduleWithClients, [date], (error, results) => {
      if (error) {
        console.error("Ошибка при получении расписания:", error.message);
        return res.status(500).json({ error: "Ошибка сервера при получении расписания." });
      }
  
      // Отправляем результаты в формате JSON
      res.status(200).json(results.rows);
    });
  };
  const fetchMasterPopularity = async (req, res) => {
    try {
        const result = await pool.query(queries.getMasterPopularity);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении популярности мастеров:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении популярности мастеров.' });
    }
  };

  const getAllReceipts = async (req, res) => {
    try {
        const result = await pool.query(queries.getAllReceipts);  // Используем новый запрос
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении данных о чеках:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении данных о чеках.' });
    }
};

// экспортируем модуль как объект, в котором будет несколько функций
module.exports = {
  fetchMasterServices,
  getReceiptByDateTime,
  getMasterSchedule,
  fetchMasterPopularity,
  getAllReceipts
};
