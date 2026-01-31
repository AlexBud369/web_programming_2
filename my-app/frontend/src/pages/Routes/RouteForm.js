import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addRoute, editRoute, fetchRoute } from '../../store/slices/routeSlice';
import { fetchCountries } from '../../store/slices/countrySlice';
import EnhancedRouteForm from '../../components/EnhancedRouteForm';
import { toast } from 'react-toastify';
import { 
  Typography, 
  Box,
  Paper,
  Container,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const RouteForm = () => {
  const { id } = useParams();
  const isEdit = id && id !== 'new' && id !== 'add';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.routes);
  const { list: countries } = useSelector((state) => state.countries);
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchCountries({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (countries.length > 0) {
      const options = countries.map(country => ({
        value: country.id,
        label: `${country.name} (${country.code})`
      }));
      setCountryOptions(options);
    }
  }, [countries]);

  useEffect(() => {
    if (isEdit && id && id !== 'new' && id !== 'add') {
      dispatch(fetchRoute(id));
    }
  }, [dispatch, id, isEdit]);

  const handleSubmit = async (data) => {
    try {
      if (isEdit) {
        await dispatch(editRoute({ id, data })).unwrap();
        toast.success('Маршрут успешно обновлен');
      } else {
        await dispatch(addRoute(data)).unwrap();
        toast.success('Маршрут успешно добавлен');
      }
      navigate('/routes');
    } catch (error) {
      toast.error(error.message || 'Ошибка сохранения маршрута');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Главная
        </Link>
        <Link
          color="inherit"
          href="/routes"
          onClick={(e) => {
            e.preventDefault();
            navigate('/routes');
          }}
        >
          Маршруты
        </Link>
        <Typography color="text.primary">
          {isEdit ? 'Редактирование' : 'Создание'}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 4 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ArrowBackIcon 
            sx={{ 
              cursor: 'pointer',
              color: 'primary.main',
              '&:hover': { color: 'primary.dark' }
            }}
            onClick={() => navigate('/routes')}
          />
          <Typography variant="h4">
            {isEdit ? 'Редактировать маршрут' : 'Добавить маршрут'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        width: '100%'
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            width: '100%',
            maxWidth: 800, 
            p: 4,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              mb: 3 
            }}
          >
            {isEdit 
              ? 'Внесите необходимые изменения в данные маршрута' 
              : 'Заполните форму для создания нового маршрута'}
          </Typography>
          
          <EnhancedRouteForm
            isEdit={isEdit}
            currentData={current}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/routes')}
            loading={loading}
            countryOptions={countryOptions}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default RouteForm;