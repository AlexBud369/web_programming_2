const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deviceInfo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'refresh_tokens',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['token'] },
      { fields: ['expiresAt'] }
    ]
  });

  return RefreshToken;
};