import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, Box, Chip, Button, CircularProgress, Alert,
  Card, CardContent, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { ArrowBack, Place, CalendarToday, Notes, Add } from '@mui/icons-material';
import { fetchDestinationById, clearCurrentDestination } from '../store/slices/destinationsSlice';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDestination: destination, loading, error } = useSelector(state => state.destinations);

  useEffect(() => {
    dispatch(fetchDestinationById(id));
    
    return () => {
      dispatch(clearCurrentDestination());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !destination) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Направление не найдено'}
        </Alert>
        <Button
          onClick={() => navigate('/destinations')}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Вернуться к списку направлений
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        onClick={() => navigate('/destinations')}
        startIcon={<ArrowBack />}
        sx={{ mt: 2, mb: 3 }}
      >
        Назад к списку
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {destination.name}
            </Typography>
            {destination.trip && (
              <Chip 
                label={`Поездка: ${destination.trip.title}`}
                color="primary"
                variant="outlined"
                component={Link}
                to={`/trips/${destination.trip.id}`}
                clickable
              />
            )}
          </Box>

          {destination.image_url ? (
            <Box>
              <img 
                src={destination.image_url} 
                alt={destination.name}
                style={{ 
                  width: '100%', 
                  maxHeight: 400, 
                  objectFit: 'cover', 
                  borderRadius: 8 
                }}
              />
            </Box>
          ) : (
            <Box 
              sx={{ 
                height: 200, 
                bgcolor: 'grey.100', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 2
              }}
            >
              <Place sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
          )}

          {destination.notes && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notes /> Заметки
              </Typography>
              <Typography variant="body1">
                {destination.notes}
              </Typography>
            </Box>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Детали направления
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Place fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Местоположение</Typography>
                    <Typography>{destination.location || 'Не указано'}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarToday fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Даты</Typography>
                    <Typography>
                      {destination.arrival_date ? new Date(destination.arrival_date).toLocaleDateString() : 'не указано'} - {' '}
                      {destination.departure_date ? new Date(destination.departure_date).toLocaleDateString() : 'не указано'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate(`/destinations/edit/${destination.id}`)}
              >
                Редактировать направление
              </Button>
            </CardContent>
          </Card>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Активности ({destination.activities?.length || 0})
            </Typography>
            
            {destination.activities && destination.activities.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Название</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell align="right">Стоимость</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {destination.activities.map((activity) => (
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
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Активности не добавлены
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/activities/new?destination_id=${destination.id}`)}
                >
                  Добавить активность
                </Button>
              </Paper>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default DestinationDetailPage;