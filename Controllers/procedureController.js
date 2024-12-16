
const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");

const addMasterSchedule = async (req, res) => {
  const { lastName, firstName, middleName, date, startTime, endTime } = req.body;

  // Проверка наличия всех параметров
  if (!lastName || !firstName || !middleName || !date || !startTime || !endTime) {
    return res.status(400).json({
      error: "Необходимо указать все параметры: lastName, firstName, middleName, date, startTime, endTime.",
    });
  }

  try {
    // Выполнение вызова процедуры с параметрами
    await pool.query(queries.addSchedule, [
      lastName,
      firstName,
      middleName,
      date,
      startTime,
      endTime,
    ]);

    // Успешная обработка
    res.status(200).json({ message: "Рабочий день успешно добавлен." });
  } catch (error) {
    console.error("Ошибка при добавлении рабочего дня:", error.message);
    // Проверка на исключение, если мастер не найден или дата уже занята
    if (error.message.includes('Мастер с именем')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('уже существует запись')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Ошибка сервера при добавлении рабочего дня." });
  }
};
const addMasterService = async (req, res) => {
  const { serviceName, masterLastName, masterFirstName, masterMiddleName } = req.body;

  // Проверка наличия всех параметров
  if (!serviceName || !masterLastName || !masterFirstName || !masterMiddleName) {
    return res.status(400).json({ error: "Необходимо указать все параметры: serviceName, masterLastName, masterFirstName, masterMiddleName." });
  }

  try {
    // Вызов процедуры для прикрепления услуги к мастеру
    await pool.query(queries.addMasterService, [
      serviceName,
      masterLastName,
      masterFirstName,
      masterMiddleName
    ]);

    res.status(200).json({ message: 'Услуга успешно прикреплена к мастеру' });
  } catch (error) {
    console.error("Ошибка при добавлении услуги мастеру:", error.message);
    if (error.message.includes('Услуга не существует')) {
      return res.status(404).json({ error: "Услуга не существует" });
    }
    if (error.message.includes('Мастер не существует')) {
      return res.status(404).json({ error: "Мастер не существует" });
    }
    if (error.message.includes('Эта услуга уже прикреплена к данному мастеру')) {
      return res.status(400).json({ error: "Эта услуга уже прикреплена к данному мастеру" });
    }
    res.status(500).json({ error: "Ошибка сервера при прикреплении услуги к мастеру." });
  }
};

module.exports = {
  addMasterSchedule,
  addMasterService
};
