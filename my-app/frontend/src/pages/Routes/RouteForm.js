import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { addRoute, editRoute, fetchRoute } from '../../store/slices/routeSlice';
import EntityForm from '../../components/EntityForm';
import { toast } from 'react-toastify';
import { fetchCountries } from '../../store/slices/countrySlice';

const RouteForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: '',
      name: '',
      durationDays: '',
      price: '',
      countryId: '',
      isActive: true,
      description: '',
      imageUrl: ''
    }
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchRoute(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (current && isEdit) {
      const formData = {
        code: current.code || '',
        name: current.name || '',
        durationDays: current.durationDays ? current.durationDays.toString() : '',
        price: current.price ? current.price.toString() : '',
        countryId: current.countryId || '',
        isActive: current.isActive || true,
        description: current.description || '',
        imageUrl: current.imageUrl || ''
      };
      reset(formData);
    }
  }, [current, reset, isEdit]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        durationDays: parseInt(data.durationDays) || 1,
        price: data.price ? parseFloat(data.price.toString().replace(',', '.')) : 0,
        countryId: data.countryId,
        isActive: data.isActive === 'true' || data.isActive === true
      };
      
      if (!formattedData.countryId) {
        toast.error('Выберите страну');
        return;
      }

      if (isEdit) {
        await dispatch(editRoute({ id, data: formattedData })).unwrap();
        toast.success('Маршрут успешно обновлен');
      } else {
        await dispatch(addRoute(formattedData)).unwrap();
        toast.success('Маршрут успешно добавлен');
      }
      
      navigate('/routes');
    } catch (error) {
      let userMessage = error.message || 'Ошибка сохранения маршрута';
      
      if (userMessage.includes('уже существует') || userMessage.includes('already exists')) {
        toast.error(userMessage + '. Пожалуйста, используйте другой код маршрута.');
      } else if (userMessage.includes('не найдена') || userMessage.includes('not found')) {
        toast.error('Указанная страна не найдена. Пожалуйста, выберите другую страну.');
      } else if (userMessage.includes('Ошибка валидации') || userMessage.includes('validation')) {
        toast.error('Проверьте введённые данные: ' + userMessage);
      } else {
        toast.error('Не удалось сохранить маршрут: ' + userMessage);
      }
    }
  };

  const fields = [
    {
      name: 'code',
      label: 'Код маршрута',
      validation: {
        required: 'Код маршрута обязателен',
        maxLength: { value: 20, message: 'Максимум 20 символов' },
        pattern: {
          value: /^[A-Z0-9\-_]+$/,
          message: 'Только заглавные буквы, цифры, дефисы и подчеркивания'
        }
      },
      helperText: 'Например: RT001, EUROPE-TOUR'
    },
    {
      name: 'name',
      label: 'Название маршрута',
      validation: {
        required: 'Название маршрута обязательно',
        minLength: { value: 3, message: 'Минимум 3 символа' },
        maxLength: { value: 200, message: 'Максимум 200 символов' }
      }
    },
    {
      name: 'durationDays',
      label: 'Длительность (дней)',
      type: 'text',
      validation: {
        required: 'Длительность обязательна',
        validate: (value) => {
          const numValue = parseInt(value);
          if (isNaN(numValue)) return 'Введите целое число';
          if (numValue < 1) return 'Длительность должна быть не менее 1 дня';
          if (numValue > 365) return 'Длительность не может превышать 365 дней';
          return true;
        }
      }
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
          if (numValue > 1000000) return 'Цена слишком большая';
          return true;
        }
      }
    },
    {
      name: 'countryId',
      label: 'Страна',
      type: 'select',
      options: countryOptions,
      validation: {
        required: 'Выберите страну',
        validate: (value) => {
          if (!value || value === '0') return 'Выберите страну';
          return true;
        }
      }
    },
    {
      name: 'isActive',
      label: 'Статус',
      type: 'select',
      options: [
        { value: true, label: 'Активный' },
        { value: false, label: 'Неактивный' }
      ],
      validation: { required: 'Выберите статус' }
    },
    {
      name: 'description',
      label: 'Описание',
      multiline: true,
      rows: 4,
      validation: {
        maxLength: { value: 10000, message: 'Максимум 10000 символов' }
      }
    },
    {
      name: 'imageUrl',
      label: 'URL изображения',
      helperText: 'Пример: https://example.com/image.jpg (необязательно)',
      validation: {
        pattern: {
          value: /^https?:\/\/.+/,
          message: 'Введите корректный URL (начинается с http:// или https://)'
        }
      }
    }
  ];

  return (
    <EntityForm
      title={isEdit ? 'Редактировать маршрут' : 'Добавить маршрут'}
      fields={fields}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      isEdit={isEdit}
      onCancel={() => navigate('/routes')}
      loading={loading}
      isSelectSupported={true}
      watch={watch}
    />
  );
};

export default RouteForm;