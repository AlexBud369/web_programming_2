import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, Box, Chip, Button, CircularProgress, Alert,
  Card, CardContent, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { ArrowBack, CalendarToday, Person, AttachMoney, Place, Add, Description } from '@mui/icons-material';
import { fetchTripById, clearCurrentTrip } from '../store/slices/tripsSlice';

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTrip: trip, loading, error } = useSelector(state => state.trips);

  useEffect(() => {
    dispatch(fetchTripById(id));
    
    return () => {
      dispatch(clearCurrentTrip());
    };
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'planned': return 'Запланирована';
      case 'active': return 'Активна';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !trip) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Поездка не найдена'}
        </Alert>
        <Button
          onClick={() => navigate('/trips')}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Вернуться к списку поездок
        </Button>
      </Container>
    );
  }

  const allActivities = trip.destinations?.flatMap(dest => dest.activities || []) || [];

  return (
    <Container maxWidth="md">
      <Button
        onClick={() => navigate('/trips')}
        startIcon={<ArrowBack />}
        sx={{ mt: 2, mb: 3 }}
      >
        Назад к списку
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {trip.title}
            </Typography>
            <Chip 
              label={getStatusText(trip.status)}
              color={getStatusColor(trip.status)}
            />
          </Box>

          {trip.image_url && (
            <Box>
              <img 
                src={trip.image_url} 
                alt={trip.title}
                style={{ 
                  width: '100%', 
                  maxHeight: 400, 
                  objectFit: 'cover', 
                  borderRadius: 8 
                }}
              />
            </Box>
          )}

          {trip.description && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description /> Описание
              </Typography>
              <Typography variant="body1">
                {trip.description}
              </Typography>
            </Box>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Детали поездки
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarToday fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Даты</Typography>
                    <Typography>
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <AttachMoney fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Бюджет</Typography>
                    <Typography>${parseFloat(trip.total_budget || 0).toFixed(2)}</Typography>
                  </Box>
                </Box>

                {trip.user && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Пользователь</Typography>
                      <Typography>{trip.user.name}</Typography>
                    </Box>
                  </Box>
                )}
              </Stack>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate(`/trips/edit/${trip.id}`)}
              >
                Редактировать поездку
              </Button>
            </CardContent>
          </Card>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Place /> Направления ({trip.destinations?.length || 0})
            </Typography>
            
            {trip.destinations && trip.destinations.length > 0 ? (
              <Stack spacing={2}>
                {trip.destinations.map((destination) => (
                  <Card key={destination.id}>
                    <CardContent>
                      <Typography variant="h6">{destination.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {destination.location}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(destination.arrival_date).toLocaleDateString()} - {' '}
                        {new Date(destination.departure_date).toLocaleDateString()}
                      </Typography>
                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/destinations/${destination.id}`)}
                      >
                        Подробнее
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Направления не добавлены
              </Typography>
            )}

            <Button
              variant="outlined"
              startIcon={<Add />}
              sx={{ mt: 2 }}
              onClick={() => navigate(`/destinations/new?trip_id=${trip.id}`)}
            >
              Добавить направление
            </Button>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Все активности ({allActivities.length})
            </Typography>
            
            {allActivities.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Активность</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell align="right">Стоимость</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allActivities.map((activity) => (
                      <TableRow 
                        key={activity.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/activities/${activity.id}`)}
                      >
                        <TableCell>
                          <Typography variant="body2">{activity.title}</Typography>
                        </TableCell>
                        <TableCell>
                          {activity.datetime ? new Date(activity.datetime).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell align="right">
                          ${parseFloat(activity.cost || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Активности не добавлены
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default TripDetailPage;