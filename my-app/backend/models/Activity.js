const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT
    },
    datetime: {
        type: DataTypes.DATE
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
            min: 0
        }
    },
    location: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'destinations',
            key: 'id'
        }
    },
    image_url: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    }
}, {
  tableName: 'activities',
  timestamps: true
});

module.exports = Activity;