import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../UI/FormContainer';
import FormField from '../UI/FormField';
import FormActions from '../UI/FormActions';
import DatePickerField from '../UI/DatePickerField';
import ImageField from '../UI/ImageField';
import useForm from '../../hooks/useForm';
import { createActivity, updateActivity } from '../../store/slices/activitiesSlice';
import { fetchDestinations } from '../../store/slices/destinationsSlice';

const ActivityForm = ({ activity, onClose }) => {
  const dispatch = useDispatch();
  const { items: destinations } = useSelector(state => state.destinations);
  
  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);
  
  const { formData, errors, submitError, setSubmitError, handleChange, validate } = useForm(
    {
      title: activity?.title || '',
      description: activity?.description || '',
      datetime: activity?.datetime ? new Date(activity.datetime) : null,
      cost: activity?.cost || '',
      location: activity?.location || '',
      type: activity?.type || '',
      image_url: activity?.image_url || '',
      destination_id: activity?.destination_id || ''
    },
    {
      title: { required: 'Название обязательно' },
      destination_id: { required: 'Необходимо выбрать направление' },
      cost: {
        validate: (value) => {
          if (value && parseFloat(value) < 0) {
            return 'Стоимость не может быть отрицательной';
          }
          return null;
        }
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validate()) return;
    
    try {
      const formattedData = {
        ...formData,
        datetime: formData.datetime ? formData.datetime.toISOString() : null,
        cost: formData.cost ? parseFloat(formData.cost) : 0
      };
      
      if (activity) {
        await dispatch(updateActivity({ id: activity.id, data: formattedData })).unwrap();
      } else {
        await dispatch(createActivity(formattedData)).unwrap();
      }
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при сохранении');
    }
  };

  const destinationOptions = destinations.map(destination => ({
    value: destination.id,
    label: `${destination.name} (${destination.trip?.title || 'без поездки'})`
  }));

  return (
      <FormContainer 
        title={activity ? 'Редактировать активность' : 'Создать активность'}
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
          label="Название активности"
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
          label="Дата и время"
          value={formData.datetime}
          onChange={handleChange('datetime')}
          type="datetime"
        />
        
        <FormField
          type="number"
          label="Стоимость"
          value={formData.cost}
          onChange={handleChange('cost')}
          error={errors.cost}
        />
        
        <FormField
          type="text"
          label="Местоположение"
          value={formData.location}
          onChange={handleChange('location')}
        />
        
        <FormField
          type="text"
          label="Тип активности"
          value={formData.type}
          onChange={handleChange('type')}
        />
        
        <FormField
          type="select"
          label="Направление"
          value={formData.destination_id}
          onChange={handleChange('destination_id')}
          options={destinationOptions}
          error={errors.destination_id}
          required
        />
        
        <ImageField
          label="URL изображения"
          value={formData.image_url}
          onChange={handleChange('image_url')}
        />
        
        <FormActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={activity ? 'Обновить' : 'Создать'}
        />
      </FormContainer>
  );
};

export default ActivityForm;