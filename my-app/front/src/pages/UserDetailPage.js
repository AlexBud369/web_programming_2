import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, Box, Chip, Button, CircularProgress, Alert,
  Card, CardContent, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { ArrowBack, Person, Email, CalendarToday, AdminPanelSettings, PersonOutline } from '@mui/icons-material';
import { fetchUserById, clearCurrentUser } from '../store/slices/usersSlice';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser: user, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUserById(id));
    
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Пользователь не найден'}
        </Alert>
        <Button
          onClick={() => navigate('/users')}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Вернуться к списку пользователей
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        onClick={() => navigate('/users')}
        startIcon={<ArrowBack />}
        sx={{ mt: 2, mb: 3 }}
      >
        Назад к списку
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                {user.avatar_url ? (
                  <Box>
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      style={{ 
                        width: 150, 
                        height: 150, 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Person sx={{ fontSize: 80, color: 'white' }} />
                  </Box>
                )}
                
                <Typography variant="h5" component="h2">
                  {user.name}
                </Typography>
                
                <Chip 
                  label={user.role === 'admin' ? 'Администратор' : 'Путешественник'}
                  color={user.role === 'admin' ? 'secondary' : 'primary'}
                  icon={user.role === 'admin' ? <AdminPanelSettings /> : <PersonOutline />}
                />
                
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Email fontSize="small" />
                    <Typography>{user.email}</Typography>
                  </Box>
                  
                  {user.created_at && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" />
                      <Typography>
                        Зарегистрирован: {new Date(user.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                >
                  Редактировать профиль
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Статистика
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Card sx={{ minWidth: 120 }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="primary">
                    {user.trips_count || 0}
                  </Typography>
                  <Typography variant="body2">Поездок</Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 120 }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="success.main">
                    ${user.total_budget?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body2">Общий бюджет</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Поездки пользователя
            </Typography>
            
            {user.trips && user.trips.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Название</TableCell>
                      <TableCell>Даты</TableCell>
                      <TableCell>Статус</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.trips.map((trip) => (
                      <TableRow 
                        key={trip.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        <TableCell>
                          <Typography variant="body2">{trip.title}</Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(trip.start_date).toLocaleDateString()} - {' '}
                          {new Date(trip.end_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              trip.status === 'planned' ? 'Запланирована' :
                              trip.status === 'active' ? 'Активна' :
                              trip.status === 'completed' ? 'Завершена' : 'Отменена'
                            }
                            size="small"
                            color={
                              trip.status === 'active' ? 'success' :
                              trip.status === 'completed' ? 'primary' :
                              trip.status === 'cancelled' ? 'error' : 'warning'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  У пользователя пока нет поездок
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/trips/new')}
                >
                  Создать первую поездку
                </Button>
              </Paper>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default UserDetailPage;