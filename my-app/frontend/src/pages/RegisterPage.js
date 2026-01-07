import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (user) {
      navigate('/profile'); 
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await dispatch(register(registerData));
      
      if (result.meta.requestStatus === 'fulfilled') {

      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Регистрация
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
              disabled={isLoading}
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <TextField
              fullWidth
              label="Пароль (минимум 6 символов)"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="new-password"
              disabled={isLoading}
              error={!!errors.password}
              helperText={errors.password}
            />
            
            <TextField
              fullWidth
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="new-password"
              disabled={isLoading}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            
            <TextField
              fullWidth
              label="Имя"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="given-name"
              disabled={isLoading}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            
            <TextField
              fullWidth
              label="Фамилия"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="family-name"
              disabled={isLoading}
              error={!!errors.lastName}
              helperText={errors.lastName}
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
                'Зарегистрироваться'
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Уже есть аккаунт? Войдите
                </Typography>
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;