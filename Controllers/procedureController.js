
const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");

const validateMasterField = (field, value) => {
  const rules = {
    lastName: /^[А-Яа-яЁё]+$/,
    firstName: /^[А-Яа-яЁё]+$/,
    middleName: /^[А-Яа-яЁё]+$/,
    birthDate: /^\d{4}-\d{2}-\d{2}$/, // Формат даты YYYY-MM-DD
    gender: /^[МЖ]$/, // M или Ж
  };

  if (!rules[field].test(value)) {
    return `${field} содержит некорректные данные.`;
  }
  return null;
};

const validateMasterFields = (fields) => {
  const errors = [];
  for (const [field, value] of Object.entries(fields)) {
    const error = validateMasterField(field, value);
    if (error) errors.push(error);
  }
  return errors;
};
const addMaster = async (req, res) => {
  const { lastName, firstName, middleName, birthDate, gender } = req.body;

  const fields = { lastName, firstName, middleName, birthDate, gender };
  const errors = validateMasterFields(fields);

  if (errors.length > 0) {
    return res.status(400).json(errors); // Возвращаем ошибки валидации
  }

  try {
    await pool.query('CALL addmaster($1, $2, $3, $4, $5)', [
      lastName,
      firstName,
      middleName,
      birthDate,
      gender,
    ]);
    res.status(200).json({ message: 'Мастер успешно добавлен.' });
  } catch (error) {
    if (error.message.includes('Мастер с такими данными уже существует.')) {
      res.status(400).json({ error: 'Мастер уже существует в системе.' });
    } else {
      console.error('Ошибка при добавлении мастера:', error.message);
      res.status(500).send('Ошибка сервера при добавлении мастера.');
    }
  }
};



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
  addMasterService,
  addMaster
};
