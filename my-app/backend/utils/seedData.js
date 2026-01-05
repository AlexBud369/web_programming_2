const fs = require('fs');
const path = require('path');
const { sequelize, Country, Route, Sale } = require('../models');

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
    console.log(`Загружены данные: ${data.countries?.length || 0} стран, ${data.routes?.length || 0} маршрутов, ${data.sales?.length || 0} продаж`);
    
    const countryCodeToId = {};
    
    if (data.countries && Array.isArray(data.countries)) {
      console.log('Создание стран...');
      
      for (const countryData of data.countries) {
        try {
          const country = await Country.create(countryData);
          countryCodeToId[country.code] = country.id; 
          console.log(`   Создана страна: ${country.name} (${country.code})`);
        } catch (error) {
          console.error(`   Ошибка при создании страны ${countryData.code}:`, error.message);
        }
      }
      console.log(`✅ Создано ${data.countries.length} стран`);
    }
    
    const routeCodeToId = {};
    
    if (data.routes && Array.isArray(data.routes)) {
      console.log('🗺️ Создание маршрутов...');
      
      for (const routeData of data.routes) {
        try {
          const countryId = countryCodeToId[routeData.countryCode];
          
          if (!countryId) {
            console.error(`   Страна с кодом "${routeData.countryCode}" не найдена для маршрута ${routeData.code}`);
            continue;
          }
          
          const route = await Route.create({
            ...routeData,
            countryId: countryId
          });
          
          routeCodeToId[route.code] = route.id; 
          console.log(`   Создан маршрут: ${route.name} (${route.code}) → страна ID: ${countryId}`);
        } catch (error) {
          console.error(`   Ошибка при создании маршрута ${routeData.code}:`, error.message);
        }
      }
      console.log(`Создано ${data.routes.length} маршрутов`);
    }
    
    if (data.sales && Array.isArray(data.sales)) {
      console.log('Создание продаж...');
      
      for (const saleData of data.sales) {
        try {
          const routeId = routeCodeToId[saleData.routeCode];
          
          if (!routeId) {
            console.error(`   Маршрут с кодом "${saleData.routeCode}" не найден для продажи`);
            continue;
          }
          
          const sale = await Sale.create({
            ...saleData,
            routeId: routeId
          });
          
          console.log(`   Создана продажа: ${sale.customerName} → маршрут ID: ${routeId}`);
        } catch (error) {
          console.error(`   Ошибка при создании продажи:`, error.message);
        }
      }
      console.log(`Создано ${data.sales.length} продаж`);
    }
    
    const totalRecords = (data.countries?.length || 0) + 
                         (data.routes?.length || 0) + 
                         (data.sales?.length || 0);
    
    console.log('\nБаза данных успешно заполнена!');
    console.log('Итого записей:', totalRecords);
    
    if (totalRecords >= 50) {
      console.log('Требование выполнено: база содержит более 50 записей');
    } else {
      console.warn(`Внимание: база содержит только ${totalRecords} записей. Нужно минимум 50 для сдачи работы.`);
      console.warn('   Добавьте больше данных в файл seed-data.json');
    }
    
  } catch (error) {
    console.error('Критическая ошибка при заполнении базы данных:');
    console.error(error);
    process.exit(1); 
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;