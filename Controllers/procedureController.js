
const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");
const validateServiceField = (field, value) => {
  const rules = {
    serviceName: /^[А-Яа-яЁёa-zA-Z0-9 ]+$/i,  // Латиница или кириллица, пробелы допустимы
    cost: /^\d+(\.\d{1,2})?$/, // Стоимость, допустимы числа с двумя знаками после запятой
    durationMinutes: /^\d+$/, // Продолжительность в минутах
    description: /^[А-Яа-яЁёa-zA-Z0-9 ]+$/i // Описание
  };

  if (!rules[field].test(value)) {
    return `${field} содержит некорректные данные.`;
  }
  return null;
};
function validateClientFields(fields) {
  const errors = [];

  if (!fields.lastName || !fields.firstName || !fields.phone || !fields.birthDate || !fields.gender) {
    errors.push('Все поля должны быть заполнены');
  }

  // Пример проверки телефона
  if (!/^[7-8]\d{10}$/.test(fields.phone)) {
    errors.push('Телефон должен быть в формате 79XXXXXXXXX');
  }

  // Пример проверки даты (если нужно)
  if (isNaN(Date.parse(fields.birthDate))) {
    errors.push('Дата рождения должна быть в правильном формате');
  }

  return errors;
}


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
    await pool.query(queries.procAddMaster, [
      lastName,
      firstName,
      middleName,
      birthDate,
      gender,
    ]);
    res.status(200).json({ message: 'Мастер успешно добавлен.' });
  } catch (error) {
    if (error.message.includes('Мастер уже существует.')) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Ошибка при добавлении мастера:', error.message);
      res.status(500).send('Ошибка сервера при добавлении мастера.');
    }
  }
};

const addService = async (req, res) => {
  const { serviceName, cost, durationMinutes, description } = req.body;

  const fields = { serviceName, cost, durationMinutes, description };
  const errors = validateServiceFields(fields);

  if (errors.length > 0) {
    return res.status(400).json(errors); // Возвращаем ошибки валидации
  }

  try {
    await pool.query(queries.addProc, [
      serviceName,
      cost,
      durationMinutes,
      description,
    ]);
    res.status(200).json({ message: 'Услуга успешно добавлена.' });
  } catch (error) {
    if (error.message.includes('Услуга с таким названием уже существует.')) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Ошибка при добавлении услуги:', error.message);
      res.status(500).send('Ошибка сервера при добавлении услуги.');
    }
  }
};

const addClient = async (req, res) => {
  const { lastName, firstName, phone, birthDate, gender } = req.body;

  const fields = { lastName, firstName, phone, birthDate, gender };
  const errors = validateClientFields(fields);

  if (errors.length > 0) {
    return res.status(400).json(errors); // Возвращаем ошибки валидации
  }

  try {
    // Вызов процедуры для добавления клиента
    await pool.query(queries.addClient, [
      lastName,
      firstName,
      phone,
      birthDate,
      gender,
    ]);
    res.status(200).json({ message: 'Клиент успешно добавлен.' });
  } catch (error) {
    // Проверка на ошибку существования клиента
    if (error.message.includes('Клиент с такими данными или номером телефона уже существует.')) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Ошибка при добавлении клиента:', error.message);
      res.status(500).send('Ошибка сервера при добавлении клиента.');
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


const addSchedule = async (req, res) => {
  const { lastName, firstName, middleName, date, startTime, endTime } = req.body;

  // Проверка наличия всех параметров
  if (!lastName || !firstName || !middleName || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "Необходимо указать все параметры: lastName, firstName, middleName, date, startTime, endTime." });
  }

  try {
      // Выполнение вызова функции AddSchedule с параметрами
      await pool.query(queries.addSchedule, [
          lastName,
          firstName,
          middleName,
          date,
          startTime,
          endTime
      ]);

      // Возвращаем успех
      res.status(200).json({ message: "Расписание успешно добавлено." });
  } catch (error) {
      console.error("Ошибка при добавлении расписания:", error);

      // Для других ошибок возвращаем общий ответ
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
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Мастер не существует')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Эта услуга уже прикреплена к данному мастеру')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Ошибка сервера при прикреплении услуги к мастеру." });
  }
};

const addClientOrderAndSchedule = async (req, res) => {
  const { clientLastName, clientFirstName, clientPhone, serviceName, masterLastName, masterFirstName, masterMiddleName, orderDate, startTime } = req.body;

  // Проверка наличия всех параметров
  if (!clientLastName || !clientFirstName || !clientPhone || !serviceName || !masterLastName || !masterFirstName || !masterMiddleName || !orderDate || !startTime) {
    return res.status(400).json({ error: "Необходимо указать все параметры." });
  }

  try {
    // Вызов процедуры для добавления заказа
    const result = await pool.query(queries.addClientOrderAndSchedule, [
      clientLastName, 
      clientFirstName, 
      clientPhone, 
      serviceName, 
      masterLastName, 
      masterFirstName, 
      masterMiddleName, 
      orderDate, 
      startTime
    ]);

    // Если заказ успешно добавлен
    res.status(200).json({ message: "Запись успешно добавлена" });
  } catch (error) {
    console.error("Ошибка при добавлении заказа:", error.message);
    
    // Обработка исключений с PostgreSQL и вывод сообщения в Postman
    if (error.message.includes('не найден')) {
      return res.status(404).json({ error: error.message });  // Например: "Клиент Иванов Иван с номером телефона 79001234567 не найден"
    } else if (error.message.includes('выходит за пределы рабочего времени')) {
      return res.status(400).json({ error: error.message });  // Например: "Время окончания услуги выходит за пределы рабочего времени мастера (20:10:00 > 18:00:00)"
    } else if (error.message.includes('Конфликт времени')) {
      return res.status(409).json({ error: error.message });  // Например: "Конфликт времени: указанный интервал пересекается с существующими заказами"
    } else if (error.message.includes('не может оказывать услугу')) {
      return res.status(400).json({ error: error.message });  // Например: "Мастер Иванов Иван не может оказывать услугу Стрижка"
    } else if (error.message.includes('не работает')) {
      return res.status(400).json({ error: error.message });}
    else {
      return res.status(500).json({ error: "Ошибка сервера при добавлении заказа." });
    }
  }
};


// Валидация данных для обновления заказа
const validateOrderFields = (fields) => {
  const errors = [];

  // Валидация каждого поля
  const { 
    clientLastName, 
    clientFirstName, 
    clientPhone, 
    serviceName, 
    masterLastName, 
    masterFirstName, 
    masterMiddleName, 
    orderDate, 
    startTime, 
    newStartTime 
  } = fields;

  if (!clientLastName || !clientFirstName || !clientPhone || !serviceName || 
      !masterLastName || !masterFirstName || !masterMiddleName || 
      !orderDate || !startTime || !newStartTime) {
    errors.push('Все поля должны быть заполнены');
  }

  return errors;
};

const updateClientOrder = async (req, res) => {
  const { 
    clientLastName, 
    clientFirstName, 
    clientPhone, 
    serviceName, 
    masterLastName, 
    masterFirstName, 
    masterMiddleName, 
    orderDate, 
    startTime, 
    newStartTime 
  } = req.body;

  // Валидация данных
  const fields = { 
    clientLastName, 
    clientFirstName, 
    clientPhone, 
    serviceName, 
    masterLastName, 
    masterFirstName, 
    masterMiddleName, 
    orderDate, 
    startTime, 
    newStartTime 
  };

  const errors = validateOrderFields(fields);

  if (errors.length > 0) {
    return res.status(400).json({ errors }); // Возвращаем ошибки валидации
  }

  try {
    // Вызов процедуры обновления заказа
    await pool.query(queries.updateClientOrder
      , [
        clientLastName,
        clientFirstName,
        clientPhone,
        serviceName,
        masterLastName,
        masterFirstName,
        masterMiddleName,
        orderDate,
        startTime,
        newStartTime
      ]);

    // Если все прошло успешно
    res.status(200).json({ message: 'Заказ успешно обновлен.' });
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error.message);

    // Обработка исключений с PostgreSQL и вывод сообщения в Postman
    if (error.message.includes('не найден')) {
      return res.status(404).json({ error: error.message });  // Например: "Клиент Иванов Иван с номером телефона 79001234567 не найден"
    } else if (error.message.includes('не работает')) {
      return res.status(400).json({ error: error.message });  // Например: "Мастер Иванов Иван не работает в день 2024-12-17"
    } else if (error.message.includes('выходит за рамки рабочего времени')) {
      return res.status(400).json({ error: error.message });  // Например: "Новая запись выходит за рамки рабочего времени мастера"
    } else if (error.message.includes('Конфликт времени')) {
      return res.status(409).json({ error: error.message });  // Например: "Конфликт времени: новый интервал пересекается с существующими заказами"
    } else {
      return res.status(500).json({ error: 'Ошибка сервера при обновлении заказа.' });
    }
  }
};

// Обновление данных клиента
const updateClientData = async (req, res) => {
  const { Last_Name, First_Name, Phone, New_Last_Name, New_First_Name, New_Birth_Date, New_Phone } = req.body;

  // Проверка на обязательные поля
  if (!Last_Name || !First_Name || !Phone) {
    return res.status(400).json({ error: "Необходимы фамилия, имя и телефон клиента." });
  }

  try {
    // Вызов процедуры для обновления данных клиента
    const result = await pool.query(queries.updateClient, [
      Last_Name, 
      First_Name, 
      Phone, 
      New_Last_Name, 
      New_First_Name, 
      New_Birth_Date, 
      New_Phone
    ]);

    // Если данных клиента не найдено
    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Клиент с именем ${First_Name} ${Last_Name} и номером телефона ${Phone} не найден.` });
    }

    // Если данные успешно обновлены
    res.status(200).json({ message: "Данные клиента обновлены успешно." });
  } catch (error) {
    console.error("Ошибка при обновлении данных клиента:", error.message);

    // Обработка исключений с PostgreSQL
    if (error.message.includes('не найден')) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Ошибка сервера при обновлении данных клиента." });
    }
  }
};

// Обновление данных мастера
// Обновление данных мастера
const updateMasterData = async (req, res) => {
  const { Last_Name, First_Name, Middle_Name, New_Last_Name, New_First_Name, New_Middle_Name, New_Birth_Date } = req.body;

  // Проверка на обязательные поля
  if (!Last_Name || !First_Name || !Middle_Name) {
    return res.status(400).json({ error: "Необходимы фамилия, имя и отчество мастера." });
  }

  try {
    // Вызов процедуры для обновления данных мастера
    const result = await pool.query(queries.updateMaster, [
      Last_Name, 
      First_Name, 
      Middle_Name, 
      New_Last_Name, 
      New_First_Name, 
      New_Middle_Name, 
      New_Birth_Date
    ]);

    // Если данных мастера не найдено
    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Мастер с именем ${First_Name} ${Last_Name} ${Middle_Name} не найден.` });
    }

    // Если данные успешно обновлены
    res.status(200).json({ message: "Данные мастера обновлены успешно." });
  } catch (error) {
    console.error("Ошибка при обновлении данных мастера:", error.message);

    // Обработка исключений с PostgreSQL
    if (error.message.includes('не найден')) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Ошибка сервера при обновлении данных мастера." });
    }
  }
};


module.exports = {
  addMasterSchedule,
  addMasterService,
  addMaster,
  addService,
  addClient,
  addSchedule,
  addClientOrderAndSchedule,
  updateClientOrder,
  updateClientData,
  updateMasterData,
  validateServiceField
};
