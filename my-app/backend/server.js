const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

require('./models/associations');

const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/users', userRoutes);    
app.use('/api/trips', tripRoutes);   
app.use('/api/destinations', destinationRoutes);
app.use('/api/activities', activityRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Travel Planner API работает!',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      trips: '/api/trips',
      destinations: '/api/destinations',
      activities: '/api/activities'
    }
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно');
    
    await sequelize.sync({ force: false });
    console.log('Модели синхронизированы с базой данных');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
      console.log(`Проверка здоровья: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();