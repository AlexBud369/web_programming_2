const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models/associations');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено.');

    await sequelize.sync({ force: false });
    console.log('Модели синхронизированы с базой данных.');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка запуска сервера:', error);
  }
};

startServer();