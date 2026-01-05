const sequelize = require('../config/database');
const Country = require('./country.model')(sequelize);
const Route = require('./route.model')(sequelize);
const Sale = require('./sale.model')(sequelize);

Country.hasMany(Route, {
  foreignKey: 'countryId',
  as: 'routes',
  onDelete: 'CASCADE'
});

Route.belongsTo(Country, {
  foreignKey: 'countryId',
  as: 'country'
});

Route.hasMany(Sale, {
  foreignKey: 'routeId',
  as: 'sales',
  onDelete: 'RESTRICT'
});

Sale.belongsTo(Route, {
  foreignKey: 'routeId',
  as: 'route'
});

module.exports = {
  Country,
  Route,
  Sale,
  sequelize
};