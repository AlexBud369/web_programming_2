require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
const { sequelize } = require('./models');

const startServer = async () => {
  try {
    console.log('Попытка подключения к базе данных...');
    
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно');
    
    await sequelize.sync({ 
      force: false,
      alter: process.env.NODE_ENV === 'development'
    });
    console.log('Модели синхронизированы с базой данных');
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`API доступно по адресу: http://localhost:${PORT}/api`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('Не удалось запустить сервер:', error.message);
    console.error('Stack trace:', error.stack);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('Проверьте:');
      console.error('1. Запущена ли база данных PostgreSQL');
      console.error('2. Правильность настроек в .env файле');
      console.error('3. Доступность хоста и порта БД');
    }
    
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();