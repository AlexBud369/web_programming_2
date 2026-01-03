import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { addSale, editSale, fetchSale } from '../../store/slices/saleSlice';
import { fetchRoutes } from '../../store/slices/routeSlice';
import EntityForm from '../../components/EntityForm';
import { toast } from 'react-toastify';

const SaleForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.sales);
  const { list: routes } = useSelector((state) => state.routes);
  const [routeOptions, setRouteOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchRoutes({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (routes.length > 0) {
      const options = routes.map(route => ({
        value: route.id,
        label: `${route.code} - ${route.name}`
      }));
      setRouteOptions(options);
    }
  }, [routes]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      purpose: '',
      price: '',
      quantity: '',
      saleDate: new Date().toISOString().split('T')[0],
      customerName: '',
      customerEmail: '',
      status: 'confirmed',
      routeId: ''
    }
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSale(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (current && isEdit) {
      const formatted = {
        ...current,
        price: current.price ? current.price.toString() : '',
        quantity: current.quantity ? current.quantity.toString() : '',
        routeId: current.routeId ? current.routeId.toString() : '',
        saleDate: current.saleDate ? new Date(current.saleDate)
        .toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      };
      reset(formatted);
    }
  }, [current, reset, isEdit]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        price: data.price ? parseFloat(data.price.toString().replace(',', '.')) : 0,
        quantity: parseInt(data.quantity) || 1,
        routeId: parseInt(data.routeId),
        saleDate: data.saleDate ? new Date(data.saleDate) : new Date()
      };

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
      
      if (userMessage.includes('уже существует') || userMessage.includes('already exists')) {
        toast.error(userMessage);
      } else if (userMessage.includes('не найд') || userMessage.includes('not found')) {
        toast.error('Указанный маршрут не найден');
      } else if (userMessage.includes('Ошибка валидации') || userMessage.includes('validation')) {
        toast.error('Проверьте введённые данные: ' + userMessage);
      } else {
        toast.error('Не удалось сохранить продажу: ' + userMessage);
      }
    }
  };

  const purposeOptions = [
    { value: 'отдых', label: 'Отдых' },
    { value: 'экскурсия', label: 'Экскурсия' },
    { value: 'лечение', label: 'Лечение' },
    { value: 'шоп-тур', label: 'Шоп-тур' },
    { value: 'обучение', label: 'Обучение' },
    { value: 'деловая', label: 'Деловая' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Ожидание' },
    { value: 'confirmed', label: 'Подтверждено' },
    { value: 'cancelled', label: 'Отменено' },
    { value: 'completed', label: 'Завершено' }
  ];

  const fields = [
    {
      name: 'purpose',
      label: 'Цель поездки',
      type: 'select',
      options: purposeOptions,
      validation: { required: 'Цель поездки обязательна' },
    },
    {
      name: 'price',
      label: 'Цена ($)',
      type: 'text',
      validation: {
        required: 'Цена обязательна',
        validate: (value) => {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return 'Введите число';
          if (numValue < 0) return 'Цена не может быть отрицательной';
          return true;
        }
      },
    },
    {
      name: 'quantity',
      label: 'Количество человек',
      type: 'text',
      validation: {
        required: 'Количество обязательно',
        validate: (value) => {
          const numValue = parseInt(value);
          if (isNaN(numValue)) return 'Введите целое число';
          if (numValue < 1) return 'Количество должно быть не меньше 1';
          return true;
        }
      },
    },
    {
      name: 'saleDate',
      label: 'Дата продажи',
      type: 'date',
      validation: { required: 'Дата продажи обязательна' },
    },
    {
      name: 'customerName',
      label: 'Имя клиента',
      validation: { 
        required: 'Имя клиента обязательно',
        maxLength: { value: 200, message: 'Максимум 200 символов' }
      },
    },
    {
      name: 'customerEmail',
      label: 'Email клиента',
      validation: {
        required: 'Email клиента обязателен',
        pattern: { 
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
          message: 'Некорректный email' 
        },
        maxLength: { value: 100, message: 'Максимум 100 символов' }
      },
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      options: statusOptions,
      validation: { required: 'Статус обязателен' },
    },
    {
      name: 'routeId',
      label: 'Маршрут',
      type: 'select',
      options: routeOptions,
      validation: { 
        required: 'Маршрут обязателен',
        validate: (value) => {
          if (!value || value === '0') return 'Выберите маршрут';
          return true;
        }
      },
      helperText: 'Выберите маршрут из списка',
    },
  ];

  return (
    <EntityForm
      title={isEdit ? 'Редактировать продажу' : 'Добавить продажу'}
      fields={fields}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      isEdit={isEdit}
      onCancel={() => navigate('/sales')}
      loading={loading}
      isSelectSupported={true}
      watch={watch}
    />
  );
};

export default SaleForm;