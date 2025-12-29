import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../UI/FormContainer';
import FormField from '../UI/FormField';
import FormActions from '../UI/FormActions';
import DatePickerField from '../UI/DatePickerField';
import ImageField from '../UI/ImageField';
import useForm from '../../hooks/useForm';
import { createTrip, updateTrip } from '../../store/slices/tripsSlice';
import { fetchUsers } from '../../store/slices/usersSlice';

const TripForm = ({ trip, onClose }) => {
  const dispatch = useDispatch();
  const { items: users } = useSelector(state => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const { formData, errors, submitError, setSubmitError, handleChange, validate, setFormData } = useForm(
    {
      title: trip?.title || '',
      description: trip?.description || '',
      start_date: trip?.start_date ? new Date(trip.start_date) : null,
      end_date: trip?.end_date ? new Date(trip.end_date) : null,
      total_budget: trip?.total_budget || '',
      status: trip?.status || 'planned',
      user_id: trip?.user_id || '',
      image_url: trip?.image_url || ''
    },
    {
      title: { required: 'Название обязательно' },
      start_date: { required: 'Дата начала обязательна' },
      end_date: { 
        required: 'Дата окончания обязательна',
        validate: (value, allData) => {
          if (allData.start_date && value && value <= allData.start_date) {
            return 'Дата окончания должна быть позже даты начала';
          }
          return null;
        }
      },
      total_budget: {
        validate: (value) => {
          if (value && parseFloat(value) < 0) {
            return 'Бюджет не может быть отрицательным';
          }
          return null;
        }
      },
      user_id: { required: 'Необходимо выбрать пользователя' }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validate()) return;
    
    try {
      const formattedData = {
        ...formData,
        start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : null,
        end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
        total_budget: formData.total_budget ? parseFloat(formData.total_budget) : 0
      };
      
      if (trip) {
        await dispatch(updateTrip({ id: trip.id, data: formattedData })).unwrap();
      } else {
        await dispatch(createTrip(formattedData)).unwrap();
      }
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при сохранении');
    }
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`
  }));

  const statusOptions = [
    { value: 'planned', label: 'Запланирована' },
    { value: 'active', label: 'Активна' },
    { value: 'completed', label: 'Завершена' },
    { value: 'cancelled', label: 'Отменена' }
  ];

  return (
      <FormContainer 
        title={trip ? 'Редактировать поездку' : 'Создать поездку'}
      >
        {submitError && (
          <FormField
            type="text"
            label="Ошибка"
            value={submitError}
            error
            disabled
          />
        )}
        
        <FormField
          type="text"
          label="Название поездки"
          value={formData.title}
          onChange={handleChange('title')}
          error={errors.title}
          required
        />
        
        <FormField
          type="textarea"
          label="Описание"
          value={formData.description}
          onChange={handleChange('description')}
          rows={3}
        />
        
        <DatePickerField
          label="Дата начала"
          value={formData.start_date}
          onChange={handleChange('start_date')}
          error={errors.start_date}
        />
        
        <DatePickerField
          label="Дата окончания"
          value={formData.end_date}
          onChange={handleChange('end_date')}
          error={errors.end_date}
        />
        
        <FormField
          type="number"
          label="Бюджет"
          value={formData.total_budget}
          onChange={handleChange('total_budget')}
          error={errors.total_budget}
        />
        
        <FormField
          type="select"
          label="Пользователь"
          value={formData.user_id}
          onChange={handleChange('user_id')}
          options={userOptions}
          error={errors.user_id}
          required
        />
        
        <FormField
          type="select"
          label="Статус"
          value={formData.status}
          onChange={handleChange('status')}
          options={statusOptions}
        />
        
        <ImageField
          label="URL изображения поездки"
          value={formData.image_url}
          onChange={handleChange('image_url')}
        />
        
        <FormActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={trip ? 'Обновить' : 'Создать'}
        />
      </FormContainer>

  );
};

export default TripForm;