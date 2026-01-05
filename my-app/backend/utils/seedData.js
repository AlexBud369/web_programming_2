const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Country = require('../models/country.model');
const Route = require('../models/route.model');
const Sale = require('../models/sale.model');

async function seedDatabase() {
  try {
    console.log('Начинаем заполнение базы данных MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_agency');
    console.log('Подключение к MongoDB установлено');
    
    await Country.deleteMany({});
    await Route.deleteMany({});
    await Sale.deleteMany({});
    console.log('Существующие данные очищены');
    
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
      
      const countries = await Country.insertMany(data.countries);
      
      countries.forEach(country => {
        countryCodeToId[country.code] = country._id;
      });
      
      console.log(`Создано ${countries.length} стран`);
    }
    
    const routeCodeToId = {};
    
    if (data.routes && Array.isArray(data.routes)) {
      console.log('Создание маршрутов...');
      
      const routePromises = data.routes.map(async (routeData) => {
        try {
          const countryId = countryCodeToId[routeData.countryCode];
          
          if (!countryId) {
            console.error(`Страна с кодом "${routeData.countryCode}" не найдена для маршрута ${routeData.code}`);
            return null;
          }
          
          const route = {
            ...routeData,
            countryId: countryId
          };
          
          delete route.countryCode;
          
          return route;
        } catch (error) {
          console.error(`Ошибка при обработке маршрута ${routeData.code}:`, error.message);
          return null;
        }
      });
      
      const routeObjects = (await Promise.all(routePromises)).filter(route => route !== null);
      
      if (routeObjects.length > 0) {
        const routes = await Route.insertMany(routeObjects);
        
        routes.forEach(route => {
          routeCodeToId[route.code] = route._id;
        });
        
        console.log(`Создано ${routes.length} маршрутов`);
      }
    }
    
    if (data.sales && Array.isArray(data.sales)) {
      console.log('Создание продаж...');
      
      const salePromises = data.sales.map(async (saleData) => {
        try {
          const routeId = routeCodeToId[saleData.routeCode];
          
          if (!routeId) {
            console.error(`Маршрут с кодом "${saleData.routeCode}" не найден для продажи`);
            return null;
          }
          
          const sale = {
            ...saleData,
            routeId: routeId
          };
          
          delete sale.routeCode;
          
          if (sale.saleDate) {
            sale.saleDate = new Date(sale.saleDate);
          }
          
          return sale;
        } catch (error) {
          console.error(`Ошибка при обработке продажи:`, error.message);
          return null;
        }
      });
      
      const saleObjects = (await Promise.all(salePromises)).filter(sale => sale !== null);
      
      if (saleObjects.length > 0) {
        const sales = await Sale.insertMany(saleObjects);
        console.log(`Создано ${sales.length} продаж`);
      }
    }
    
    const totalCountries = await Country.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const totalSales = await Sale.countDocuments();
    const totalRecords = totalCountries + totalRoutes + totalSales;
    
    console.log('\nБаза данных успешно заполнена!');
    console.log('Итоговая статистика:');
    console.log(`  Стран: ${totalCountries}`);
    console.log(`  Маршрутов: ${totalRoutes}`);
    console.log(`  Продаж: ${totalSales}`);
    console.log(`  Всего записей: ${totalRecords}`);
    
    if (totalRecords >= 50) {
      console.log('Требование выполнено: база содержит более 50 записей');
    } else {
      console.warn(`Внимание: база содержит только ${totalRecords} записей. Нужно минимум 50 для сдачи работы.`);
      console.warn('Добавьте больше данных в файл seed-data.json');
    }
    
    await mongoose.connection.close();
    console.log('Соединение с MongoDB закрыто');
    
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