import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { fetchUsers } from '../../store/slices/userSlice';
import UserTable from '../../components/UserTable';
import RoleDndBoard from '../../components/RoleDndBoard';
import PageHeader from '../../components/PageHeader';
import { toast } from 'react-toastify';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { list: users, total, loading } = useSelector((state) => state.users);
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('active');

  const loadData = useCallback(() => {
    const filters = {};
    if (roleFilter !== 'all') filters.role = roleFilter;
    if (activeFilter !== 'all') filters.isActive = activeFilter === 'active';
    
    dispatch(fetchUsers({ 
      limit: 100,
      sort: 'createdAt', 
      order: 'DESC', 
      search,
      ...filters 
    }));
  }, [dispatch, search, roleFilter, activeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUsersUpdated = () => {
    toast.info('Обновление данных...');
    loadData();
  };

  const columns = [
    { 
      id: 'avatar', 
      label: '', 
      render: (row) => (
        <Avatar src={row.avatar} sx={{ width: 32, height: 32 }}>
          {row.firstName?.[0]}{row.lastName?.[0]}
        </Avatar>
      ),
      size: 60,
    },
    { 
      id: 'fullName', 
      label: 'ФИО', 
      render: (row) => `${row.firstName} ${row.lastName}` 
    },
    { id: 'email', label: 'Email' },
    { 
      id: 'role', 
      label: 'Роль', 
      render: (row) => (
        <Chip 
          label={row.role === 'admin' ? 'Админ' : 'Пользователь'} 
          color={row.role === 'admin' ? 'error' : 'primary'} 
          size="small" 
        />
      ) 
    },
    { 
      id: 'status', 
      label: 'Статус', 
      render: (row) => (
        <Chip 
          label={row.isActive ? 'Активен' : 'Неактивен'} 
          color={row.isActive ? 'success' : 'default'} 
          size="small" 
        />
      ) 
    },
    { 
      id: 'lastLogin', 
      label: 'Последний вход', 
      render: (row) => row.lastLogin 
        ? new Date(row.lastLogin).toLocaleDateString('ru-RU') 
        : 'Никогда' 
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader 
        title="Управление пользователями" 
        subtitle="Расширенная таблица с DnD функционалом"
        addButton={false}
        actionButtons={
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Обновить
          </Button>
        }
      />

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Роль"
            select
            size="small"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Все роли</MenuItem>
            <MenuItem value="admin">Администраторы</MenuItem>
            <MenuItem value="user">Пользователи</MenuItem>
          </TextField>
          
          <TextField
            select
            label="Статус"
            size="small"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Все статусы</MenuItem>
            <MenuItem value="active">Активные</MenuItem>
            <MenuItem value="inactive">Неактивные</MenuItem>
          </TextField>
          
          <TextField
            label="Поиск"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Имя, email..."
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
          
          <Typography variant="body2" sx={{ ml: 'auto' }}>
            Всего: {users.length} пользователей
          </Typography>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Таблица (сортировка, фильтрация, выбор строк)" />
          <Tab label="Drag-and-Drop (перетаскивание между колонками)" />
        </Tabs>
        
        <Typography variant="body2" color="text.secondary">
          {tabValue === 0 
            ? 'Расширенная таблица с сортировкой (клик по заголовку), фильтрацией, выбором строк (чекбоксы) и экспортом'
            : 'Перетаскивайте пользователей между колонками, чтобы изменить их роль.'}
        </Typography>
      </Paper>

      {tabValue === 0 ? (
        <UserTable
          data={users}
          columns={columns}
          loading={loading}
        />
      ) : (
        <RoleDndBoard 
          users={users} 
          loading={loading} 
          onUsersUpdated={handleUsersUpdated}
        />
      )}
    </Container>
  );
};

export default UserManagementPage;