const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, RefreshToken, PasswordResetToken } = require('../models');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    return await User.create(userData);
  }

  async login(email, password) {
    const user = await User.findOne({ 
      where: { 
        email,
        isActive: true 
      } 
    });
    
    if (!user) {
      throw new Error('Пользователь не найден или заблокирован');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Неверный пароль');
    }

    user.lastLogin = new Date();
    await user.save();

    return user;
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, token) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    return await RefreshToken.create({
      userId,
      token,
      expiresAt
    });
  }

  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const refreshToken = await RefreshToken.findOne({
        where: { 
          token,
          isRevoked: false,
          expiresAt: { [Op.gt]: new Date() }
        }
      });
      
      return refreshToken ? decoded : null;
    } catch (error) {
      return null;
    }
  }

  async revokeRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ where: { token } });
    if (refreshToken) {
      refreshToken.isRevoked = true;
      await refreshToken.save();
    }
  }

  async createPasswordResetToken(email) {
    const user = await User.findOne({ 
      where: { 
        email,
        isActive: true 
      } 
    });
    
    if (!user) return null;
    
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); 
    
    return await PasswordResetToken.create({
      token,
      expiresAt,
      userId: user.id
    });
  }

  async resetPassword(token, newPassword) {
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{
        model: User,
        as: 'user'
      }]
    });
    
    if (!resetToken || !resetToken.user) {
      return false;
    }
    
    resetToken.user.password = newPassword;
    await resetToken.user.save();
    
    resetToken.isUsed = true;
    await resetToken.save();
    
    return true;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) return false;
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return false;
    
    user.password = newPassword;
    await user.save();
    
    return true;
  }

  formatUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      lastLogin: user.lastLogin
    };
  }
}

module.exports = new AuthService();