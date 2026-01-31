const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Route = sequelize.define('Route', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: 'Код маршрута уже существует'
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Название маршрута обязательно'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1], 
          msg: 'Длительность должна быть не менее 1 дня'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: {  
          msg: 'Цена должна быть числом'
        },
        min: 0 
      }
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],  
          msg: 'ID страны должно быть положительным числом'
        }
      }
    },
    startSeasonDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: 'Недопустимая дата начала сезона' }
      }
    },
    endSeasonDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: 'Недопустимая дата конца сезона' }
      }
    }
  }, {
    tableName: 'routes',
    timestamps: true
  });

  Route.searchFields = ['code', 'name', 'description'];

  return Route;
};