const sequelize = require('./config/database');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    // Просто заполним таблицы данными без пересоздания
    const { User, Trip, Destination, Activity } = require('./models/associations');
    
    const usersCount = await User.count();
    if (usersCount === 0) {
      console.log('База пустая, заполняем...');
      
      // Создаем пользователей
      const users = await User.bulkCreate([
        { name: 'Иван Петров', email: 'ivan@mail.com', password_hash: await bcrypt.hash('password1', 10), role: 'traveler' },
        { name: 'Мария Сидорова', email: 'maria@mail.com', password_hash: await bcrypt.hash('password2', 10), role: 'admin' },
        { name: 'Алексей Смирнов', email: 'alex@mail.com', password_hash: await bcrypt.hash('password3', 10), role: 'traveler' }
      ]);
      
      // Создаем путешествия
      const trips = await Trip.bulkCreate([
        { title: 'Отпуск в Париже', start_date: '2024-07-01', end_date: '2024-07-10', budget: 150000, status: 'planned', user_id: 1 },
        { title: 'Бизнес-трип в Берлин', start_date: '2024-08-15', end_date: '2024-08-20', budget: 80000, status: 'completed', user_id: 1 },
        { title: 'Семейный отдых в Сочи', start_date: '2024-06-10', end_date: '2024-06-20', budget: 120000, status: 'active', user_id: 2 }
      ]);
      
      // Создаем пункты назначения
      const destinations = await Destination.bulkCreate([
        { name: 'Париж', location: 'Франция', start_date: '2024-07-01', end_date: '2024-07-05', trip_id: 1 },
        { name: 'Берлин', location: 'Германия', start_date: '2024-08-15', end_date: '2024-08-20', trip_id: 2 },
        { name: 'Сочи', location: 'Россия', start_date: '2024-06-10', end_date: '2024-06-20', trip_id: 3 }
      ]);
      
      // Создаем активности
      await Activity.bulkCreate([
        { title: 'Экскурсия в Лувр', datetime: '2024-07-02 10:00:00', cost: 2000, destination_id: 1 },
        { title: 'Посещение Эйфелевой башни', datetime: '2024-07-03 09:00:00', cost: 2500, destination_id: 1 },
        { title: 'Встреча с партнерами', datetime: '2024-08-16 09:00:00', cost: 0, destination_id: 2 },
        { title: 'Пляжный отдых', datetime: '2024-06-11 10:00:00', cost: 0, destination_id: 3 }
      ]);
      
      console.log(`Создано: ${users.length} пользователей, ${trips.length} путешествий, ${destinations.length} пунктов назначения`);
    } else {
      console.log(`База уже содержит ${usersCount} пользователей`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы:', error);
    process.exit(1);
  }
}

seedDatabase();