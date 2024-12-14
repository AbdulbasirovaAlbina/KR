const pool = require("../db");
const queries = require("../queries");
const { body, validationResult } = require("express-validator");

const validateCooperatorData = [
  body("surname", "Поле Фамилия не должно быть пустым и должно содержать только буквы русского алфавита").isAlpha("ru-RU", { ignore: " " }),
  body("name", "Поле Имя не должно быть пустым и должно содержать только буквы русского алфавита").isAlpha("ru-RU", { ignore: " " }),
  body("birthday", "Поле Дата рождения должно быть в формате даты")
    .custom((value) => {
      if (!/^\d{2}[./-]\d{2}[./-]\d{4}$/.test(value)) {
        throw new Error("Недопустимый формат даты");
      }
      return true;
    })
    .custom((value) => {
      const currentDate = new Date();
      if (new Date(value) > currentDate) {
        throw new Error("Дата рождения не может быть будущей");
      }
      return true;
    }),
  body("city", "Поле Город не должно быть пустым и должно содержать только буквы русского алфавита").isAlpha("ru-RU", { ignore: " " }),
  body("dept_name", "Поле Название отдела не должно быть пустым и должно содержать только буквы русского алфавита").isAlpha("ru-RU", { ignore: " " }),
  body("comp_name", "Поле Название компании не должно быть пустым и должно содержать только буквы русского алфавита").isAlpha("ru-RU", { ignore: " " }),
];

const procAddCooperator = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { surname, name, birthday, city, dept_name, comp_name } = req.body;

  pool.query(queries.procAddCooperator, [surname, name, birthday, city, dept_name, comp_name], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error", details: error });
    }
    res.status(200).send("Cooperator inserted");
  });
};

const procUpdateSalary = (req, res) => {
  const percent = parseInt(req.params.percent);
  if (isNaN(percent) || percent <= 0 || percent > 100) {
    return res.status(400).json({ error: "Invalid percentage" });
  }

  pool.query(queries.procUpdateSalary, [percent], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error", details: error });
    }
    res.status(200).send("Salary updated successfully");
  });
};

const procRemoveCooperator = (req, res) => {
  pool.query('CALL DeleteCooperator()', (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error", details: error });
    }
    res.status(200).send("Cooperator removed successfully");
  });
};

module.exports = {
  procAddCooperator,
  procUpdateSalary,
  procRemoveCooperator,
  validateCooperatorData,
};