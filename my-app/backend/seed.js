const sequelize = require('./config/database');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    const { User, Trip, Destination, Activity } = require('./models/associations');
    
    const usersCount = await User.count();
    if (usersCount === 0) {
      console.log('База пустая, заполняем...');
      
      // Создаем пользователей с аватарками
      const users = await User.bulkCreate([
        { 
          name: 'Иван Петров', 
          email: 'ivan@mail.com', 
          password_hash: await bcrypt.hash('password1', 10), 
          role: 'traveler',
          avatar_url: 'https://i.pravatar.cc/150?img=1'
        },
        { 
          name: 'Мария Сидорова', 
          email: 'maria@mail.com', 
          password_hash: await bcrypt.hash('password2', 10), 
          role: 'admin',
          avatar_url: 'https://i.pravatar.cc/150?img=2'
        },
        { 
          name: 'Алексей Смирнов', 
          email: 'alex@mail.com', 
          password_hash: await bcrypt.hash('password3', 10), 
          role: 'traveler',
          avatar_url: 'https://i.pravatar.cc/150?img=3'
        }
      ]);
      
      // Создаем путешествия с изображениями
      const trips = await Trip.bulkCreate([
        { 
          title: 'Отпуск в Париже', 
          description: 'Романтическое путешествие в столицу Франции',
          start_date: '2024-07-01', 
          end_date: '2024-07-10', 
          total_budget: 150000, 
          status: 'planned', 
          user_id: 1,
          image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
        },
        { 
          title: 'Бизнес-трип в Берлин', 
          description: 'Деловая поездка на конференцию',
          start_date: '2024-08-15', 
          end_date: '2024-08-20', 
          total_budget: 80000, 
          status: 'completed', 
          user_id: 1,
          image_url: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w-800'
        },
        { 
          title: 'Семейный отдых в Сочи', 
          description: 'Отдых с детьми на черноморском побережье',
          start_date: '2024-06-10', 
          end_date: '2024-06-20', 
          total_budget: 120000, 
          status: 'active', 
          user_id: 2,
          image_url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800'
        }
      ]);
      
      // Создаем пункты назначения с изображениями
      const destinations = await Destination.bulkCreate([
        { 
          name: 'Париж', 
          location: 'Франция', 
          arrival_date: '2024-07-01', 
          departure_date: '2024-07-05', 
          notes: 'Столица моды и искусства',
          trip_id: 1,
          image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800'
        },
        { 
          name: 'Берлин', 
          location: 'Германия', 
          arrival_date: '2024-08-15', 
          departure_date: '2024-08-20', 
          notes: 'Деловой центр Европы',
          trip_id: 2,
          image_url: 'https://images.unsplash.com/photo-1587332066582-21dd50b75c1b?w=800'
        },
        { 
          name: 'Сочи', 
          location: 'Россия', 
          arrival_date: '2024-06-10', 
          departure_date: '2024-06-20', 
          notes: 'Курортный город на Черном море',
          trip_id: 3,
          image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
        }
      ]);
      
      // Создаем активности с изображениями
      await Activity.bulkCreate([
        { 
          title: 'Экскурсия в Лувр', 
          description: 'Групповая экскурсия с гидом',
          datetime: '2024-07-02 10:00:00', 
          cost: 2000, 
          location: 'Лувр, Париж',
          type: 'экскурсия',
          destination_id: 1,
          image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
        },
        { 
          title: 'Посещение Эйфелевой башни', 
          description: 'Подъем на смотровую площадку',
          datetime: '2024-07-03 09:00:00', 
          cost: 2500, 
          location: 'Эйфелева башня',
          type: 'развлечение',
          destination_id: 1,
          image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800'
        },
        { 
          title: 'Встреча с партнерами', 
          description: 'Деловой обед и обсуждение контракта',
          datetime: '2024-08-16 09:00:00', 
          cost: 0, 
          location: 'Офис компании',
          type: 'бизнес',
          destination_id: 2,
          image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800'
        },
        { 
          title: 'Пляжный отдых', 
          description: 'Отдых на городском пляже',
          datetime: '2024-06-11 10:00:00', 
          cost: 0, 
          location: 'Пляж "Ривьера"',
          type: 'отдых',
          destination_id: 3,
          image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        },
        { 
          title: 'Посещение океанариума', 
          description: 'Семейный поход в океанариум',
          datetime: '2024-06-12 14:00:00', 
          cost: 1500, 
          location: 'Сочинский океанариум',
          type: 'развлечение',
          destination_id: 3,
          image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
        }
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