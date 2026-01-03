const fs = require('fs');
const path = require('path');
const { sequelize, Country, Route, Sale } = require('../models');

async function seedDatabase() {
  try {
    console.log('🔄 Начинаем заполнение базы данных...');
    
    // 1. Синхронизация моделей с БД (force: true удаляет и пересоздает таблицы)
    // Внимание: это удалит ВСЕ существующие данные!
    await sequelize.sync({ force: true });
    console.log('✅ Таблицы созданы/пересозданы');
    
    // 2. Путь к файлу с данными
    const projectRoot = path.join(__dirname, '../..'); // Два уровня вверх
    const seedFile = path.join(projectRoot, 'database/seed-data.json');
    
    // Проверка существования файла
    if (!fs.existsSync(seedFile)) {
      throw new Error(`Файл ${seedFile} не найден!`);
    }
    
    // 3. Чтение и парсинг JSON
    const data = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    console.log(`📊 Загружены данные: ${data.countries?.length || 0} стран, ${data.routes?.length || 0} маршрутов, ${data.sales?.length || 0} продаж`);
    
    // 4. Карта для связи кодов стран с их ID
    const countryCodeToId = {};
    
    // 5. Создание стран
    if (data.countries && Array.isArray(data.countries)) {
      console.log('🌍 Создание стран...');
      
      for (const countryData of data.countries) {
        try {
          const country = await Country.create(countryData);
          countryCodeToId[country.code] = country.id; // Сохраняем связь код → ID
          console.log(`   Создана страна: ${country.name} (${country.code})`);
        } catch (error) {
          console.error(`   Ошибка при создании страны ${countryData.code}:`, error.message);
        }
      }
      console.log(`✅ Создано ${data.countries.length} стран`);
    }
    
    // 6. Карта для связи кодов маршрутов с их ID
    const routeCodeToId = {};
    
    // 7. Создание маршрутов (после стран, т.к. есть внешний ключ)
    if (data.routes && Array.isArray(data.routes)) {
      console.log('🗺️ Создание маршрутов...');
      
      for (const routeData of data.routes) {
        try {
          // Получаем ID страны по коду
          const countryId = countryCodeToId[routeData.countryCode];
          
          if (!countryId) {
            console.error(`   Страна с кодом "${routeData.countryCode}" не найдена для маршрута ${routeData.code}`);
            continue;
          }
          
          // Создаем маршрут с правильным countryId
          const route = await Route.create({
            ...routeData,
            countryId: countryId
          });
          
          routeCodeToId[route.code] = route.id; // Сохраняем связь код → ID
          console.log(`   Создан маршрут: ${route.name} (${route.code}) → страна ID: ${countryId}`);
        } catch (error) {
          console.error(`   Ошибка при создании маршрута ${routeData.code}:`, error.message);
        }
      }
      console.log(`✅ Создано ${data.routes.length} маршрутов`);
    }
    
    // 8. Создание продаж (после маршрутов, т.к. есть внешний ключ)
    if (data.sales && Array.isArray(data.sales)) {
      console.log('💰 Создание продаж...');
      
      for (const saleData of data.sales) {
        try {
          // Получаем ID маршрута по коду
          const routeId = routeCodeToId[saleData.routeCode];
          
          if (!routeId) {
            console.error(`   Маршрут с кодом "${saleData.routeCode}" не найден для продажи`);
            continue;
          }
          
          // Создаем продажу с правильным routeId
          const sale = await Sale.create({
            ...saleData,
            routeId: routeId
          });
          
          console.log(`   Создана продажа: ${sale.customerName} → маршрут ID: ${routeId}`);
        } catch (error) {
          console.error(`   Ошибка при создании продажи:`, error.message);
        }
      }
      console.log(`✅ Создано ${data.sales.length} продаж`);
    }
    
    // 9. Итоговая статистика
    const totalRecords = (data.countries?.length || 0) + 
                         (data.routes?.length || 0) + 
                         (data.sales?.length || 0);
    
    console.log('\n🎉 База данных успешно заполнена!');
    console.log('📈 Итого записей:', totalRecords);
    
    // Проверяем соответствие требованиям (минимум 50 записей)
    if (totalRecords >= 50) {
      console.log('✅ Требование выполнено: база содержит более 50 записей');
    } else {
      console.warn(`⚠️  Внимание: база содержит только ${totalRecords} записей. Нужно минимум 50 для сдачи работы.`);
      console.warn('   Добавьте больше данных в файл seed-data.json');
    }
    
  } catch (error) {
    console.error('❌ Критическая ошибка при заполнении базы данных:');
    console.error(error);
    process.exit(1); // Завершаем процесс с ошибкой
  }
}

// Проверка, что файл запущен напрямую, а не импортирован как модуль
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;