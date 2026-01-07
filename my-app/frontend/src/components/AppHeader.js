import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import AccountCircle from '@mui/icons-material/AccountCircle';

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          flexGrow: 1, 
          textDecoration: 'none', 
          color: 'inherit' 
        }}>
          Платформа планирования путешествий
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
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
              
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {user?.firstName}
                  </Typography>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfile}>
                    <Typography variant="body2">
                      Профиль ({user?.role === 'admin' ? 'Админ' : 'Пользователь'})
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </Menu>
              </div>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Войти
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Регистрация
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;