const sequelize = require('../config/database');
const Country = require('./country.model')(sequelize);
const Route = require('./route.model')(sequelize);
const Sale = require('./sale.model')(sequelize);
const User = require('./user.model')(sequelize);
const RefreshToken = require('./refreshToken.model')(sequelize);
const PasswordResetToken = require('./passwordResetToken.model')(sequelize);

// Связи существующих моделей
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

// Новые связи для системы аутентификации

// Связи пользователя
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE'
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(PasswordResetToken, {
  foreignKey: 'userId',
  as: 'passwordResetTokens',
  onDelete: 'CASCADE'
});

PasswordResetToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Связь пользователя с продажами (кто создал запись)
User.hasMany(Sale, {
  foreignKey: 'createdBy',
  as: 'createdSales',
  onDelete: 'SET NULL'
});

Sale.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

module.exports = {
  Country,
  Route,
  Sale,
  User,
  RefreshToken,
  PasswordResetToken,
  sequelize
};