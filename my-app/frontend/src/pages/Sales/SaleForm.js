import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addSale, editSale, fetchSale } from '../../store/slices/saleSlice';
import { fetchRoutes } from '../../store/slices/routeSlice';
import EnhancedSaleForm from '../../components/EnhancedSaleForm';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';

const SaleForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { current, loading } = useSelector((state) => state.sales);
  const { list: routes } = useSelector((state) => state.routes);
  const { user } = useSelector((state) => state.auth);
  const [hasAccess, setHasAccess] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        await dispatch(fetchRoutes({ page: 1, limit: 100 })).unwrap();
      } catch (error) {
        toast.error('Ошибка загрузки маршрутов');
      }
    };
    loadRoutes();
  }, [dispatch]);

  useEffect(() => {
    const loadSale = async () => {
      if (isEdit && id && !isNaN(parseInt(id))) {
        setIsLoadingData(true);
        try {
          await dispatch(fetchSale(id)).unwrap();
        } catch (error) {
          toast.error('Ошибка загрузки данных продажи');
          navigate('/sales');
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    loadSale();
  }, [dispatch, id, isEdit, navigate]);

  useEffect(() => {
    if (isEdit && current) {
      if (user && user.role !== 'admin' && current.createdBy !== user.id) {
        toast.error('У вас нет прав для редактирования этой продажи');
        setHasAccess(false);
        return;
      }
    }
  }, [current, isEdit, user]);

  const prepareFormData = (data) => {
    const selectedRoute = routes?.find(r => r.id.toString() === data.routeId?.toString());
    const basePrice = selectedRoute ? parseFloat(selectedRoute.price) : 0;
    
    const validExtraServices = (data.extraServices || []).filter(
      service => service && service.name && service.name.trim() !== ''
    );
    
    const extrasTotal = validExtraServices.reduce((sum, service) => 
      sum + (parseFloat(service?.price) || 0), 0) || 0;
    
    const totalPrice = (basePrice + extrasTotal) * (parseInt(data.quantity) || 1);
    
    return {
      ...data,
      price: totalPrice,
      quantity: parseInt(data.quantity),
      routeId: parseInt(data.routeId),
      saleDate: data.saleDate,
      extraServices: validExtraServices
    };
  };

  const handleSubmit = async (data) => {
    try {
      const formattedData = prepareFormData(data);

      if (isEdit) {
        await dispatch(editSale({ id, data: formattedData })).unwrap();
        toast.success('Продажа успешно обновлена');
      } else {
        await dispatch(addSale(formattedData)).unwrap();
        toast.success('Продажа успешно добавлена');
      }
      
      navigate('/sales');
    } catch (error) {
      let userMessage = error.message || 'Ошибка сохранения продажи';
      
      if (userMessage.includes('уже существует')) {
        toast.error(userMessage);
      } else if (userMessage.includes('не найд')) {
        toast.error('Указанный маршрут не найден');
      } else if (userMessage.includes('Ошибка валидации')) {
        toast.error('Проверьте введённые данные: ' + userMessage);
      } else {
        toast.error('Не удалось сохранить продажу: ' + userMessage);
      }
    }
  };

  const prepareInitialData = () => {
    if (isEdit && current) {
      let extraServices = current.extraServices || [];
      
      if (typeof extraServices === 'string') {
        try {
          extraServices = JSON.parse(extraServices);
        } catch (error) {
          extraServices = [];
        }
      }
      
      return {
        ...current,
        routeId: current.routeId?.toString() || '',
        quantity: current.quantity || 1,
        saleDate: current.saleDate ? new Date(current.saleDate) : new Date(),
        extraServices: extraServices,
        status: current.status || 'confirmed'
      };
    }
    return null;
  };

  const handleCancel = () => {
    navigate('/sales');
  };

  if (!hasAccess && isEdit) {
    return <Navigate to="/sales" />;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {isEdit ? 'Редактировать продажу' : 'Новая продажа'}
      </Typography>
      
      <EnhancedSaleForm
        onSubmit={handleSubmit}
        isEdit={isEdit}
        initialData={prepareInitialData()}
        loading={loading || isLoadingData}
        onCancel={handleCancel}
      />
    </Paper>
  );
};

export default SaleForm;