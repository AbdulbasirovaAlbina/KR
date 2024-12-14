//имопрт пула БД
const pool = require("../db");
const queries = require("../queries");

//выборка всех записей из таблицы Coopertor
const getCooperator = (req, res) => {
  pool.query(queries.getCooperator, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows); // если нет ошибки, то вернется статус 200
  });
};

//поиск записи по значению id
const getCooperatorById = (req, res) => {
  const id = parseInt(req.params.id); //получение значения Id
  pool.query(queries.getCooperatorById, [id], (error, results) => {
    // запрос к БД по полученному Id
    if (error) throw error;
    res.status(200).json(results.rows); //если статус вернулся 200 тогда получить результат в формате json
  });
};

const addCooperator = (req, res) => {
  const { surname, name, birthday, city, salary, category, start_date, dept_id, phone_number, passport_num, passport_ser, passport_data } = req.body; // извлекаем данные из тела объекта

  // перед добавлением новой записи проверим есть ли такой сотрудник уже в БД
  pool.query(queries.checkLastnameCooperator, [surname], (error, results) => {
    if (results.rows.length) {
      res.send("Surname already exists");
    }
    //если такого сотрудника нет в БД тогда выполняем следующее:
    pool.query(
      queries.addCooperator,
      [surname, name, birthday, city, salary, category, start_date, dept_id, phone_number, passport_num, passport_ser, passport_data],
      (error, results) => {
        if (error) throw error; //если есть ошибка, то вывести сообщение об ошибке
        res.status(201).send("Cooperator insered");
        console.log("Cooperator insered");
      }
    );
  });
};

const updateCooperator = (req, res) => {
  const id = parseInt(req.params.id);
  const { surname } = req.body;

  
  pool.query(queries.getCooperatorById, [id], (error, results) => {
    const noCooperatorFound = !results.rows.length;
    if (noCooperatorFound) {
      res.send("Cooperator does not exist in the DB");
    }

    
    pool.query(queries.updateCooperator, [surname, id], (error, results) => {
      if (error) throw error;
      res.status(200).send("Cooperator update successfully");
    });
  });
};

//удаление записи по значению id
const removeCooperator = (req, res) => {
  const id = parseInt(req.params.id);

  //обработаем случай, когда в БД нет сотрудника, которого нужно удалить
  //проверка по id с использованием ранее созданного метода getCooperatorById
  pool.query(queries.getCooperatorById, [id], (error, results) => {
    const noCooperatorFound = !results.rows.length;
    if (noCooperatorFound) {
      res.send("Cooperator does not exist in the DB");
    }
    // если id сотрудника есть в таблице, тогда удалем этого сотрудника
    pool.query(queries.removeCooperator, [id], (error, results) => {
      if (error) throw error;
      res.status(200).send("Cooperator remove successfully");
    });
  });
};

// экспортируем модуль как объект, в котором будет несколько функций
module.exports = {
  getCooperator,
  getCooperatorById,
  addCooperator,
  updateCooperator,
  removeCooperator,
};
