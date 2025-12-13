const User = require('./User');
const Trip = require('./Trip');
const Destination = require('./Destination');
const Activity = require('./Activity');

// User имеет много Trip (One-to-Many)
User.hasMany(Trip, {
    foreignKey: 'user_id',
    as: 'trips',
    onDelete: 'CASCADE'
});
Trip.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Trip имеет много Destination (One-to-Many)
Trip.hasMany(Destination, {
    foreignKey: 'trip_id',
    as: 'destinations',
    onDelete: 'CASCADE'
});
Destination.belongsTo(Trip, {
    foreignKey: 'trip_id',
    as: 'trip'
});

// Destination имеет много Activity (One-to-Many)
Destination.hasMany(Activity, {
    foreignKey: 'destination_id',
    as: 'activities',
    onDelete: 'CASCADE'
});
Activity.belongsTo(Destination, {
    foreignKey: 'destination_id',
    as: 'destination'
});

module.exports = {
  User,
  Trip,
  Destination,
  Activity
};