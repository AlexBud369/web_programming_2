import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSale } from '../../store/slices/saleSlice';
import EntityCard from '../../components/EntityCard';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';

const SaleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.sales);

  useEffect(() => {
    if (id && !isNaN(parseInt(id))) {
      dispatch(fetchSale(id));
    } else {
      navigate('/sales');
    }
  }, [dispatch, id, navigate]);

  const parseExtraServices = (extraServices) => {
    if (!extraServices) return [];
    
    try {
      if (typeof extraServices === 'string') {
        return JSON.parse(extraServices);
      }
      return extraServices;
    } catch (error) {
      console.error('Error parsing extraServices:', error);
      return [];
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (!current) return <p>Продажа не найдена</p>;

  const extraServices = parseExtraServices(current.extraServices);
  const totalExtraServicesCost = extraServices.reduce((sum, service) => 
    sum + (parseFloat(service.price) || 0), 0
  );

  const fields = [
    { key: 'purpose', label: 'Цель поездки' },
    { 
      key: 'price', 
      label: 'Общая стоимость ($)', 
      render: (val) => `${parseFloat(val).toFixed(2)} $`
    },
    { key: 'quantity', label: 'Количество человек' },
    { 
      key: 'saleDate', 
      label: 'Дата продажи', 
      render: (val) => new Date(val).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    { key: 'customerName', label: 'Имя клиента' },
    { key: 'customerEmail', label: 'Email клиента' },
    { 
      key: 'status', 
      label: 'Статус',
      render: (val) => {
        const statusMap = {
          'pending': 'Ожидание',
          'confirmed': 'Подтверждено',
          'cancelled': 'Отменено',
          'completed': 'Завершено'
        };
        return statusMap[val] || val;
      }
    },
    { 
      key: 'routeId', 
      label: 'ID маршрута',
      render: (val) => {
        if (current.route && current.route.name) {
          return `${current.route.name} (ID: ${val})`;
        }
        return `ID: ${val}`;
      }
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      <EntityCard
        entity={current}
        titleField="customerName"
        fields={fields}
        basePath="/sales"
        entityType="sales"
      />
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Дополнительные услуги
        </Typography>
        
        {extraServices.length > 0 ? (
          <>
            <List>
              {extraServices.map((service, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={service.name || 'Без названия'}
                      secondary={`Стоимость: ${(parseFloat(service.price) || 0).toFixed(2)} $`}
                    />
                  </ListItem>
                  {index < extraServices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body1">
                <strong>Итого за дополнительные услуги:</strong> {totalExtraServicesCost.toFixed(2)} $
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
            Нет дополнительных услуг
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SaleDetail;