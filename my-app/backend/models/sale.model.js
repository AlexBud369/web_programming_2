const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sale = sequelize.define('Sale', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    purpose: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: {
          args: [['отдых', 'экскурсия', 'лечение', 'шоп-тур', 'обучение', 'деловая']],
          msg: 'Недопустимая цель поездки'
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1], 
          msg: 'Количество должно быть не меньше 1'
        }
      }
    },
    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    customerName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Имя клиента обязательно'
        }
      }
    },
    customerEmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Недопустимый email'
        }
      }
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'confirmed',
      validate: {
        isIn: {
          args: [['pending', 'confirmed', 'cancelled', 'completed']],
          msg: 'Недопустимый статус'
        }
      }
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1], 
          msg: 'ID маршрута должен быть положительным'
        }
      }
    }
  }, {
    tableName: 'sales',
    timestamps: true,
    indexes: [
      { fields: ['saleDate'] },
      { fields: ['status'] }
    ]
  });

  Sale.searchFields = ['purpose', 'customerName', 'customerEmail'];

  return Sale;
};