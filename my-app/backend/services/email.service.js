const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendPasswordReset(email, resetToken) {
    const tokenValue = resetToken.token || resetToken;
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${tokenValue}`;
    
    const mailOptions = {
      from: `"Travel Planner" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Сброс пароля - Travel Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Сброс пароля</h2>
          <p>Вы запросили сброс пароля для вашего аккаунта в Travel Planner.</p>
          <p>Для сброса пароля перейдите по ссылке:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
          <p>Ссылка действительна в течение 1 часа.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Ошибка отправки email:', error);
      throw new Error('Не удалось отправить письмо для сброса пароля');
    }
  }

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: `"Travel Planner" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Добро пожаловать в Travel Planner!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Добро пожаловать, ${name}!</h2>
          <p>Спасибо за регистрацию в сервисе Travel Planner.</p>
          <p>Теперь вы можете планировать свои путешествия, просматривать маршруты и управлять своими покупками.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Ошибка отправки welcome email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();