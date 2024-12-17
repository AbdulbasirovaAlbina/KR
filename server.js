const queryRouter = require("./routes/queryRouter");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const userRouter = require("./routes/userRouter");  

const publicPath = path.join(__dirname, "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); // Теперь можно устанавливать и извлекать файлы cookie, используя объекты res и req соответственно.
app.use(express.static(publicPath));
app.use("/user", userRouter);  

app.use("/api/query", queryRouter);


//Для тестирования работы сервера
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "login.html")); // Возвращаем login.html
});

app.get("/home", (req, res) => {
  if (req.cookies && req.cookies.username) {
    res.send(`С возвращением, ${req.cookies.username}!`);
  } else {
    res.send("Пожалуйста, войдите в систему.");
  }
});


require("dotenv").config(); // Загружаем переменные среды из файла .env

const port = process.env.PORT || 3001; // Используем переменную PORT из .env или дефолтное значение
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
