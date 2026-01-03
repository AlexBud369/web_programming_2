import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const AppHeader = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Платформа планирования путешествий
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/countries"
            variant={isActive('/countries') ? 'outlined' : 'text'}
            sx={{ borderColor: 'white' }}
          >
            Страны
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/routes"
            variant={isActive('/routes') ? 'outlined' : 'text'}
            sx={{ borderColor: 'white' }}
          >
            Маршруты
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/sales"
            variant={isActive('/sales') ? 'outlined' : 'text'}
            sx={{ borderColor: 'white' }}
          >
            Продажи
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;