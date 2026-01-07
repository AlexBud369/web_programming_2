const fs = require('fs');
const path = require('path');
const { sequelize, Country, Route, Sale, User, RefreshToken, PasswordResetToken } = require('../models');

async function seedDatabase() {
  try {
    console.log('Начинаем заполнение базы данных...');
    
    await sequelize.sync({ force: true });
    console.log('Таблицы созданы/пересозданы');
    
    const projectRoot = path.join(__dirname, '../..'); 
    const seedFile = path.join(projectRoot, 'database/seed-data.json');
    
    if (!fs.existsSync(seedFile)) {
      throw new Error(`Файл ${seedFile} не найден!`);
    }
    
    const data = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    console.log(`Загружены данные: ${data.users?.length || 0} пользователей, ${data.countries?.length || 0} стран, ${data.routes?.length || 0} маршрутов, ${data.sales?.length || 0} продаж`);
    
    const createdUsers = {};
    
    if (data.users && Array.isArray(data.users)) {
      console.log('\nСоздание пользователей из JSON...');
      
      for (const userData of data.users) {
        try {
          const user = await User.create(userData);
          createdUsers[user.email] = user.id;
        } catch (error) {
          console.error(`Ошибка при создании пользователя ${userData.email}:`, error.message);
        }
      }
      console.log(`Создано ${data.users.length} пользователей`);
    }
    
    const countryCodeToId = {};
    
    if (data.countries && Array.isArray(data.countries)) {
      console.log('\nСоздание стран...');
      
      for (const countryData of data.countries) {
        try {
          const country = await Country.create(countryData);
          countryCodeToId[country.code] = country.id;
        } catch (error) {
          console.error(`Ошибка при создании страны ${countryData.code}:`, error.message);
        }
      }
      console.log(`Создано ${data.countries.length} стран`);
    }
    
    const routeCodeToId = {};
    
    if (data.routes && Array.isArray(data.routes)) {
      console.log('\nСоздание маршрутов...');
      
      for (const routeData of data.routes) {
        try {
          const countryId = countryCodeToId[routeData.countryCode];
          
          if (!countryId) {
            console.error(`Страна с кодом "${routeData.countryCode}" не найдена для маршрута ${routeData.code}`);
            continue;
          }
          
          const route = await Route.create({
            code: routeData.code,
            name: routeData.name,
            description: routeData.description,
            durationDays: routeData.durationDays,
            price: routeData.price,
            imageUrl: routeData.imageUrl,
            isActive: routeData.isActive,
            countryId: countryId
          });
          
          routeCodeToId[route.code] = route.id;
        } catch (error) {
          console.error(`Ошибка при создании маршрута ${routeData.code}:`, error.message);
        }
      }
      console.log(`Создано ${data.routes.length} маршрутов`);
    }
    
    if (data.sales && Array.isArray(data.sales)) {
      console.log('\nСоздание продаж с привязкой к пользователям...');
      
      const activeUserIds = Object.entries(createdUsers)
        .filter(([email]) => {
          const userData = data.users.find(u => u.email === email);
          return userData && userData.isActive !== false;
        })
        .map(([_, id]) => id);
      
      if (activeUserIds.length === 0) {
        console.error('Нет активных пользователей для привязки продаж');
      } else {
        let saleCount = 0;
        
        for (const saleData of data.sales) {
          try {
            const routeId = routeCodeToId[saleData.routeCode];
            
            if (!routeId) {
              console.error(`Маршрут с кодом "${saleData.routeCode}" не найден для продажи`);
              continue;
            }
            
            const createdByUserId = activeUserIds[Math.floor(Math.random() * activeUserIds.length)];
            
            await Sale.create({
              purpose: saleData.purpose,
              price: saleData.price,
              quantity: saleData.quantity,
              saleDate: saleData.saleDate,
              customerName: saleData.customerName,
              customerEmail: saleData.customerEmail,
              status: saleData.status,
              routeId: routeId,
              createdBy: createdByUserId
            });
            
            saleCount++;
          } catch (error) {
            console.error('Ошибка при создании продажи:', error.message);
          }
        }
        console.log(`Создано ${saleCount} продаж, распределенных между пользователями`);
      }
    }
    
    const totalRecords = (data.users?.length || 0) + 
                        (data.countries?.length || 0) + 
                        (data.routes?.length || 0) + 
                        (data.sales?.length || 0);
    
    console.log('\nБаза данных успешно заполнена!');
    console.log('========================================');
    console.log('Статистика:');
    console.log(`   Пользователи: ${data.users?.length || 0}`);
    console.log(`   Страны: ${data.countries?.length || 0}`);
    console.log(`   Маршруты: ${data.routes?.length || 0}`);
    console.log(`   Продажи: ${data.sales?.length || 0}`);
    console.log(`   Итого записей: ${totalRecords}`);
    console.log('========================================');
    
    if (totalRecords >= 50) {
      console.log('Требование выполнено: база содержит более 50 записей');
    } else {
      console.warn(`Внимание: база содержит только ${totalRecords} записей. Нужно минимум 50 для сдачи работы.`);
      console.warn('Добавьте больше данных в файл seed-data.json');
    }
    
    console.log('\nТестовые данные для входа:');
    console.log('========================================');
    console.log('Администратор:');
    console.log('   Email: admin@travelplanner.com');
    console.log('   Пароль: admin123');
    console.log('   Роль: admin (видит все продажи, может создавать страны/маршруты)');
    console.log('\nОбычные пользователи:');
    console.log('   Email: user1@travelplanner.com');
    console.log('   Пароль: user123');
    console.log('   Роль: user (видит только свои продажи)');
    console.log('\n   Email: user2@travelplanner.com');
    console.log('   Пароль: user123');
    console.log('   Роль: user');
    console.log('\n   Email: user3@travelplanner.com');
    console.log('   Пароль: user123');
    console.log('   Роль: user');
    console.log('\nНеактивный пользователь:');
    console.log('   Email: inactive@travelplanner.com');
    console.log('   Пароль: user123');
    console.log('   Статус: неактивен (не сможет войти)');
    console.log('========================================');
    
  } catch (error) {
    console.error('Критическая ошибка при заполнении базы данных:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;