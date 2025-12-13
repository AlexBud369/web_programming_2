const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        notEmpty: true,
            len: [3, 200]
        }
    },
    description: {
        type: DataTypes.TEXT
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isEndDateAfterStartDate(value) {
                if (new Date(value) <= new Date(this.start_date)) {
                    throw new Error('Дата окончания должна быть позже даты начала.');
                }
            }
        }
    },
    total_budget: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.ENUM('planned', 'active', 'completed', 'cancelled'),
        defaultValue: 'planned'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
  tableName: 'trips',
  timestamps: true
});

module.exports = Trip;