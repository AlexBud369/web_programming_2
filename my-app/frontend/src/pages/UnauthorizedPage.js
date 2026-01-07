import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          
          <Typography variant="h4" gutterBottom color="error">
            Доступ запрещен
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            У вас недостаточно прав для доступа к этой странице.
            Только администраторы могут создавать и редактировать страны и маршруты.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Если вы считаете, что это ошибка, обратитесь к администратору системы.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button 
              component={Link} 
              to="/" 
              variant="contained"
              color="primary"
            >
              На главную
            </Button>
            
            <Button 
              component={Link} 
              to="/profile" 
              variant="outlined"
            >
              Мой профиль
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;