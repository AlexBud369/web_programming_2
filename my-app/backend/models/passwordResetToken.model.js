const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    tableName: 'password_reset_tokens',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['token'] },
      { fields: ['expiresAt'] }
    ]
  });

  return PasswordResetToken;
};