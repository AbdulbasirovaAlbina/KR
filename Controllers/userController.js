

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // Подключение к базе данных

const secretKey = process.env.secretKey; // Секретный ключ для JWT

const getLogin = async (req, res) => {
  const { username, password } = req.body; // Получаем данные из формы

  try {
    // Получаем пользователя из базы данных по имени
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];

    // Проверяем, если пользователь не найден
    if (!user) {
      console.warn(`Неудачная попытка входа для пользователя: ${username}`);
      return res.status(401).json({ message: "Пользователь не найден или неверный пароль" });
    }

    // Проверяем пароль
    //const passwordMatch = await bcrypt.compare(password, user.password);
    if (password != user.password) {
      console.warn(`Неверный пароль для пользователя: ${username}`);
      return res.status(401).json({ message: "Пользователь не найден или неверный пароль" });
    }

    // Генерация JWT токена с сроком действия 2 часа
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "2h",
    });

    // Сохраняем токен в cookies на 2 часа
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 часа
      sameSite: "Strict",
      secure: false, // Для локальной разработки
    });

    // Сохраняем имя пользователя в cookies на 2 часа
    res.cookie("username", username, {
      maxAge: 2 * 60 * 60 * 1000, // 2 часа
      sameSite: "Strict",
      secure: false, // Для локальной разработки
    });

    // Перенаправляем на домашнюю страницу
    res.redirect("/home");
  } catch (error) {
    console.error("Ошибка при аутентификации", error);
    res.status(500).send("Ошибка при аутентификации");
  }
};

const getRedirectHome = async (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username) {
    const user = req.cookies.username;
    res.send(`Приветствуем, ${user}!`);
  } else {
    res.send("Пожалуйста, войдите в систему, чтобы просмотреть эту страницу!");
  }
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Записываем пароль без хеширования
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, password] // Передаем пароль без хеширования
    );
    const user = result.rows[0];
    res.status(201).json(user);
  } catch (error) {
    console.error("Ошибка при регистрации", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLogin,
  getRedirectHome,
  registerUser,
};
