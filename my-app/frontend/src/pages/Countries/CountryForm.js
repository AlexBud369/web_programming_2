import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { addCountry, editCountry, fetchCountry } from '../../store/slices/countrySlice';
import EntityForm from '../../components/EntityForm';
import { toast } from 'react-toastify';

const CountryForm = () => {
  const { id } = useParams();
  const isEdit = id && id !== 'new' && id !== 'add';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.countries);

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
      visaCost: '',
      description: '',
      flagImage: ''
    }
  });

  useEffect(() => {
    if (isEdit && id && id !== 'new' && id !== 'add') {
      dispatch(fetchCountry(id));
    }
  }, [dispatch, id, isEdit]);
  
  useEffect(() => {
    if (current && isEdit) {
      const formData = {
        code: current.code || '',
        name: current.name || '',
        visaCost: current.visaCost ? current.visaCost.toString() : '',
        description: current.description || '',
        flagImage: current.flagImage || ''
      };
      reset(formData);
    }
  }, [current, reset, isEdit]);

  const onSubmit = async (data) => {
    try {
      let visaCost = data.visaCost;
      if (typeof visaCost === 'string') {
        visaCost = visaCost.replace(',', '.');
      }
      
      const visaCostNum = parseFloat(visaCost);
      if (isNaN(visaCostNum)) {
        toast.error('Введите корректное число для стоимости визы');
        return;
      }
      
      const formattedData = {
        ...data,
        visaCost: visaCostNum
      };
      
      if (isEdit) {
        await dispatch(editCountry({ id, data: formattedData })).unwrap();
        toast.success('Страна успешно обновлена');
      } else {
        await dispatch(addCountry(formattedData)).unwrap();
        toast.success('Страна успешно добавлена');
      }
      
      navigate('/countries');
    } catch (error) {
      toast.error(error.message || 'Ошибка сохранения страны');
    }
  };

  const fields = [
    {
      name: 'code',
      label: 'Код страны',
      validation: {
        required: 'Код страны обязателен',
        minLength: { value: 2, message: 'Минимум 2 символа' },
        maxLength: { value: 10, message: 'Максимум 10 символов' },
        pattern: {
          value: /^[A-Z0-9]+$/,
          message: 'Только заглавные буквы и цифры'
        }
      },
      helperText: 'Например: RU, US, FR (2-10 символов, заглавные буквы и цифры)'
    },
    {
      name: 'name',
      label: 'Название страны',
      validation: {
        required: 'Название страны обязательно',
        maxLength: { value: 100, message: 'Максимум 100 символов' }
      }
    },
    {
      name: 'visaCost',
      label: 'Стоимость визы ($)',
      type: 'text',
      validation: {
        required: 'Стоимость визы обязательна',
        validate: (value) => {
          if (!value) return true;
          const strValue = value.toString().replace(',', '.');
          const numValue = parseFloat(strValue);
          if (isNaN(numValue)) return 'Введите корректное число';
          if (numValue < 0) return 'Стоимость не может быть отрицательной';
          return true;
        }
      },
      helperText: 'Введите число (можно с точкой или запятой)'
    },
    {
      name: 'description',
      label: 'Описание',
      multiline: true,
      rows: 4,
      validation: {
        maxLength: { value: 5000, message: 'Максимум 5000 символов' }
      }
    },
    {
      name: 'flagImage',
      label: 'URL изображения флага',
      helperText: 'Пример: https://flagcdn.com/w320/ru.png',
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
      title={isEdit ? 'Редактировать страну' : 'Добавить страну'}
      fields={fields}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      isEdit={isEdit}
      onCancel={() => navigate('/countries')}
      loading={loading}
      watch={watch}
    />
  );
};

export default CountryForm;