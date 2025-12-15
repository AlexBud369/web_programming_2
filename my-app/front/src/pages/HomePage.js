import { Typography, Paper, Button, Stack } from '@mui/material';
import { People, Flight, Place, DirectionsRun } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const items = [
    { icon: <People />, label: 'Пользователи', path: '/users' },
    { icon: <Flight />, label: 'Поездки', path: '/trips' },
    { icon: <Place />, label: 'Направления', path: '/destinations' },
    { icon: <DirectionsRun />, label: 'Активности', path: '/activities' },
  ];

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Платформа планирования путешествий
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
        Управляйте поездками, направлениями и активностями
      </Typography>
      
      <Stack spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
        {items.map((item, index) => (
          <Button
            key={index}
            variant="outlined"
            size="large"
            startIcon={item.icon}
            onClick={() => navigate(item.path)}
            sx={{
              justifyContent: 'flex-start',
              py: 2,
              px: 3,
              fontSize: '1.1rem'
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
};

export default HomePage;