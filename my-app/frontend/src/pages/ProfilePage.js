import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userStats, setUserStats] = useState({
    salesCount: 0,
    lastLogin: null
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const salesResponse = await api.get('/sales?limit=1');
      setUserStats(prev => ({
        ...prev,
        salesCount: salesResponse.data.total || 0
      }));
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Новый пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Пароль успешно изменен');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangePassword(false);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при смене пароля');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Профиль пользователя
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 120, height: 120, mb: 2 }}
                  src={user.avatar}
                >
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography 
                  variant="body1" 
                  color={user.role === 'admin' ? 'error.main' : 'primary.main'}
                  sx={{ fontWeight: 'bold' }}
                >
                  {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Имя пользователя" 
                    secondary={`${user.firstName} ${user.lastName}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Роль" 
                    secondary={user.role === 'admin' ? 'Администратор (полный доступ)' : 'Пользователь (ограниченный доступ)'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Продажи" 
                    secondary={`Всего продаж: ${userStats.salesCount}`}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Управление аккаунтом
              </Typography>
              
              {!changePassword ? (
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Безопасность аккаунта
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => setChangePassword(true)}
                      startIcon={<SecurityIcon />}
                    >
                      Сменить пароль
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Box component="form" onSubmit={handlePasswordSubmit}>
                  <Typography variant="h6" gutterBottom>
                    Смена пароля
                  </Typography>
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
                    </Alert>
                  )}
                  
                  <TextField
                    fullWidth
                    label="Текущий пароль"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    margin="normal"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  
                  <TextField
                    fullWidth
                    label="Новый пароль"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    margin="normal"
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                    helperText="Минимум 6 символов"
                  />
                  
                  <TextField
                    fullWidth
                    label="Подтвердите новый пароль"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    margin="normal"
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SecurityIcon />}
                    >
                      {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setChangePassword(false);
                        setError('');
                        setSuccess('');
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    После смены пароля вы будете автоматически выйдены из всех устройств, кроме текущего.
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>Ваши права:</strong> {user.role === 'admin' 
                  ? 'Вы можете создавать, редактировать и удалять страны, маршруты и видеть все продажи.' 
                  : 'Вы можете просматривать страны и маршруты, а также создавать и просматривать только свои продажи.'}
              </Typography>

              {user.role === 'admin' && (
                <>
                  <Divider sx={{ my: 3 }} />
                  
                  <Card variant="outlined" sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Административная панель
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Расширенные функции управления системой
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => navigate('/users')}
                        startIcon={<AdminPanelSettingsIcon />}
                        fullWidth
                      >
                        Управление пользователями
                      </Button>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" component="div">
                          • Расширенная таблица с сортировкой и фильтрацией
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="div">
                          • Drag-and-drop для изменения ролей
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="div">
                          • Выбор строк и массовые операции
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfilePage;