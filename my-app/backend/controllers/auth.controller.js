const authService = require('../services/auth.service');
const emailService = require('../services/email.service');
const { User } = require('../models'); 

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      const tokens = authService.generateTokens(user);
      await authService.saveRefreshToken(user.id, tokens.refreshToken);
      
      emailService.sendWelcomeEmail(user.email, user.firstName)
        .catch(err => console.error('Ошибка отправки welcome email:', err));
      
      res.status(201).json({
        user: authService.formatUser(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const user = await authService.login(req.body.email, req.body.password);
      const tokens = authService.generateTokens(user);
      await authService.saveRefreshToken(user.id, tokens.refreshToken);
      
      res.json({
        user: authService.formatUser(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      const decoded = await authService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({ message: 'Неверный или истекший refresh token' });
      }
      
      await authService.revokeRefreshToken(refreshToken);
      
      const user = await User.findByPk(decoded.id); 
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      
      const tokens = authService.generateTokens(user);
      await authService.saveRefreshToken(user.id, tokens.refreshToken);
      
      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await authService.revokeRefreshToken(refreshToken);
      }
      
      res.json({ message: 'Выход выполнен успешно' });
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      
      const resetToken = await authService.createPasswordResetToken(email);
      
      if (resetToken) {
        await emailService.sendPasswordReset(email, resetToken);
      }
      
      res.json({ 
        message: 'Если email зарегистрирован, письмо для сброса пароля будет отправлено' 
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      
      const success = await authService.resetPassword(token, newPassword);
      if (!success) {
        return res.status(400).json({ message: 'Неверный или истекший токен' });
      }
      
      res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      const success = await authService.changePassword(userId, currentPassword, newPassword);
      if (!success) {
        return res.status(400).json({ message: 'Неверный текущий пароль' });
      }
      
      res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(authService.formatUser(user));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();