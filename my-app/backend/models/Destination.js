const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destination = sequelize.define('Destination', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: DataTypes.STRING
    },
    arrival_date: {
        type: DataTypes.DATEONLY
    },
    departure_date: {
        type: DataTypes.DATEONLY
    },
    notes: {
        type: DataTypes.TEXT
    },
    image_url: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
    trip_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trips',
            key: 'id'
        }
    }
}, {
  tableName: 'destinations',
  timestamps: true
});

module.exports = Destination;