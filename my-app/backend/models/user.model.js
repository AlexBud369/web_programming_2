const { DataTypes } = require('sequelize');
const validator = require('validator');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Пользователь с таким email уже существует'
      },
      validate: {
        isEmail: {
          msg: 'Недопустимый формат email'
        },
        notEmpty: {
          msg: 'Email обязателен для заполнения'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'Пароль должен содержать от 6 до 100 символов'
        },
        notEmpty: {
          msg: 'Пароль обязателен для заполнения'
        }
      }
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Имя обязательно для заполнения'
        },
        len: {
          args: [2, 50],
          msg: 'Имя должно содержать от 2 до 50 символов'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Фамилия обязательна для заполнения'
        },
        len: {
          args: [2, 50],
          msg: 'Фамилия должна содержать от 2 до 50 символов'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'admin']],
          msg: 'Недопустимая роль пользователя'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isValidUrl(value) {
          if (value && value.trim() !== '' && !validator.isURL(value)) {
            throw new Error('Недопустимый URL для аватара');
          }
        }
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  User.searchFields = ['email', 'firstName', 'lastName'];

  return User;
};