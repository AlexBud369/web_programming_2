import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../UI/FormContainer';
import FormField from '../UI/FormField';
import FormActions from '../UI/FormActions';
import DatePickerField from '../UI/DatePickerField';
import ImageField from '../UI/ImageField';
import useForm from '../../hooks/useForm';
import { createDestination, updateDestination } from '../../store/slices/destinationsSlice';
import { fetchTrips } from '../../store/slices/tripsSlice';

const DestinationForm = ({ destination, onClose }) => {
  const dispatch = useDispatch();
  const { items: trips } = useSelector(state => state.trips);
  
  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);
  
  const { formData, errors, submitError, setSubmitError, handleChange, validate } = useForm(
    {
      name: destination?.name || '',
      location: destination?.location || '',
      arrival_date: destination?.arrival_date ? new Date(destination.arrival_date) : null,
      departure_date: destination?.departure_date ? new Date(destination.departure_date) : null,
      notes: destination?.notes || '',
      image_url: destination?.image_url || '',
      trip_id: destination?.trip_id || ''
    },
    {
      name: { required: 'Название обязательно' },
      trip_id: { required: 'Необходимо выбрать поездку' },
      arrival_date: {
        validate: (value, allData) => {
          if (value && allData.departure_date && allData.departure_date < value) {
            return 'Дата отъезда должна быть позже даты приезда';
          }
          return null;
        }
      },
      departure_date: {
        validate: (value, allData) => {
          if (value && allData.arrival_date && value < allData.arrival_date) {
            return 'Дата отъезда должна быть позже даты приезда';
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
        arrival_date: formData.arrival_date ? formData.arrival_date.toISOString().split('T')[0] : null,
        departure_date: formData.departure_date ? formData.departure_date.toISOString().split('T')[0] : null,
      };
      
      if (destination) {
        await dispatch(updateDestination({ id: destination.id, data: formattedData })).unwrap();
      } else {
        await dispatch(createDestination(formattedData)).unwrap();
      }
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при сохранении');
    }
  };

  const tripOptions = trips.map(trip => ({
    value: trip.id,
    label: `${trip.title} (с ${new Date(trip.start_date).toLocaleDateString()} по ${new Date(trip.end_date).toLocaleDateString()})`
  }));

  return (
      <FormContainer 
        title={destination ? 'Редактировать направление' : 'Создать направление'}
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
          label="Название направления"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
        />
        
        <FormField
          type="text"
          label="Местоположение"
          value={formData.location}
          onChange={handleChange('location')}
        />
        
        <DatePickerField
          label="Дата приезда"
          value={formData.arrival_date}
          onChange={handleChange('arrival_date')}
          error={errors.arrival_date}
        />
        
        <DatePickerField
          label="Дата отъезда"
          value={formData.departure_date}
          onChange={handleChange('departure_date')}
          error={errors.departure_date}
        />
        
        <FormField
          type="textarea"
          label="Заметки"
          value={formData.notes}
          onChange={handleChange('notes')}
          rows={3}
        />
        
        <FormField
          type="select"
          label="Поездка"
          value={formData.trip_id}
          onChange={handleChange('trip_id')}
          options={tripOptions}
          error={errors.trip_id}
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
          submitLabel={destination ? 'Обновить' : 'Создать'}
        />
      </FormContainer>

  );
};

export default DestinationForm;