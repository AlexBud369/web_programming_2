require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Попытка подключения к MongoDB...');
    
    await connectDB();
    console.log('Соединение с MongoDB установлено успешно');
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`API доступно по адресу: http://localhost:${PORT}/api`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('Не удалось запустить сервер:', error.message);
    console.error('Stack trace:', error.stack);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Проверьте:');
      console.error('1. Запущен ли сервер MongoDB');
      console.error('2. Правильность MONGODB_URI в .env файле');
      console.error('3. Доступность localhost:27017');
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