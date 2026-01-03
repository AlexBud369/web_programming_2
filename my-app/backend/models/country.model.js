const { DataTypes } = require('sequelize');
const validator = require('validator');

module.exports = (sequelize) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: {
        msg: 'Код страны уже существует'
      },
      validate: {
        len: {
          args: [2, 10],
          msg: 'Код должен быть от 2 до 10 символов'
        }
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Название страны обязательно'
        }
      }
    },
    visaCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: {
          msg: 'Стоимость визы должна быть числом'
        },
        min: 0  
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    flagImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isValidUrl(value) {
          if (value && value.trim() !== '' && !validator.isURL(value)) {
            throw new Error('Недопустимый URL для флага');
          }
        }
      }
    }
  }, {
    tableName: 'countries',
    timestamps: true
  });

  Country.searchFields = ['code', 'name', 'description'];

  return Country;
};