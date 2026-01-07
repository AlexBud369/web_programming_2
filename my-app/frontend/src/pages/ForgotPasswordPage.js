import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Alert,
  CircularProgress 
} from '@mui/material';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Отправка запроса на восстановление пароля для:', email);
      
      const fullUrl = 'http://localhost:5000/api/auth/request-password-reset';
      console.log('Полный URL:', fullUrl);
      
      const response = await api.post('/auth/request-password-reset', { email });
     
      console.log('Ответ сервера:', response.data);
      
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Произошла ошибка');
      }
      
    } catch (err) {
      console.error('Ошибка при запросе восстановления пароля:', err);
      console.error('Детали ошибки:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        config: err.response?.config?.url
      });

      if (err.message && err.message.includes('Network Error')) {
        setError('Ошибка соединения с сервером. Проверьте, запущен ли сервер на localhost:5000');
      } else if (err.response?.status === 500) {
        setError('Внутренняя ошибка сервера. Проверьте логи сервера.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка на сервере. Попробуйте позже');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Восстановление пароля
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Инструкции по восстановлению пароля отправлены на ваш email.
              Проверьте вашу почту.
            </Alert>
          )}

          {!success && (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Введите email, указанный при регистрации. Мы отправим вам ссылку для сброса пароля.
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="email"
                  placeholder="test@example.com"
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, height: 48 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Отправить ссылку для сброса'
                  )}
                </Button>
              </form>
            </>
          )}
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button 
              component="button" 
              onClick={() => navigate('/login')}
              variant="text"
            >
              Вернуться к входу
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;