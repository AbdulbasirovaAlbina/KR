const procedureRoutes = require("./routes/procedureRouter");
const functionRoutes = require("./routes/functionRouter");
const queryRouter = require("./routes/queryRouter");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const publicPath = path.join(__dirname, "public");


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); // Теперь можно устанавливать и извлекать файлы cookie, используя объекты res и req соответственно.
//app.use("/api/query", query_router);
app.use(express.static(publicPath));


app.use("/api/query", queryRouter);
app.use("/api/procedure", procedureRoutes);
app.use("/api/function", functionRoutes);


require("dotenv").config(); // Загружаем переменные среды из файла .env

const port = process.env.PORT || 3001; // Используем переменную PORT из .env или дефолтное значение
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
