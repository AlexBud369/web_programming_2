import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, Box, Chip, Button, CircularProgress, Alert,
  Card, CardContent, Divider, Stack
} from '@mui/material';
import { ArrowBack, CalendarToday, AttachMoney, Place, Description } from '@mui/icons-material';
import { fetchActivityById, clearCurrentActivity } from '../store/slices/activitiesSlice';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentActivity: activity, loading, error } = useSelector(state => state.activities);

  useEffect(() => {
    dispatch(fetchActivityById(id));
    
    return () => {
      dispatch(clearCurrentActivity());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !activity) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Активность не найдена'}
        </Alert>
        <Button
          onClick={() => navigate('/activities')}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Вернуться к списку активностей
        </Button>
      </Container>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'не указано';
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="md">
      <Button
        onClick={() => navigate('/activities')}
        startIcon={<ArrowBack />}
        sx={{ mt: 2, mb: 3 }}
      >
        Назад к списку
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {activity.title}
            </Typography>
            {activity.type && (
              <Chip 
                label={activity.type}
                color="primary"
                sx={{ mb: 2 }}
              />
            )}
          </Box>

          {activity.image_url && (
            <Box>
              <img 
                src={activity.image_url} 
                alt={activity.title}
                style={{ 
                  width: '100%', 
                  maxHeight: 400, 
                  objectFit: 'cover', 
                  borderRadius: 8 
                }}
              />
            </Box>
          )}

          {activity.description && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description /> Описание
              </Typography>
              <Typography variant="body1">
                {activity.description}
              </Typography>
            </Box>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Детали активности
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarToday fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Дата и время</Typography>
                    <Typography>{formatDateTime(activity.datetime)}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <AttachMoney fontSize="small" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Стоимость</Typography>
                    <Typography>${parseFloat(activity.cost || 0).toFixed(2)}</Typography>
                  </Box>
                </Box>

                {activity.location && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Place fontSize="small" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Местоположение</Typography>
                      <Typography>{activity.location}</Typography>
                    </Box>
                  </Box>
                )}

                {activity.destination && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Направление</Typography>
                    <Chip 
                      label={activity.destination.name}
                      color="primary"
                      variant="outlined"
                      component={Link}
                      to={`/destinations/${activity.destination.id}`}
                      clickable
                    />
                  </Box>
                )}
              </Stack>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate(`/activities/edit/${activity.id}`)}
              >
                Редактировать активность
              </Button>
            </CardContent>
          </Card>

          <Divider />

          <Box>
            <Typography variant="body2" color="text.secondary">
              ID: {activity.id}
              {activity.created_at && ` • Создано: ${new Date(activity.created_at).toLocaleDateString()}`}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ActivityDetailPage;