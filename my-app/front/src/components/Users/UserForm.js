import React from 'react';
import { useDispatch } from 'react-redux';
import FormContainer from '../UI/FormContainer';
import FormField from '../UI/FormField';
import FormActions from '../UI/FormActions';
import ImageField from '../UI/ImageField';
import useForm from '../../hooks/useForm';
import { createUser, updateUser } from '../../store/slices/usersSlice';

const UserForm = ({ user, onClose }) => {
  const dispatch = useDispatch();
  
  const { formData, errors, submitError, setSubmitError, handleChange, validate } = useForm(
    {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'traveler',
      avatar_url: user?.avatar_url || ''
    },
    {
      name: { required: 'Имя обязательно' },
      email: { 
        required: 'Email обязателен',
        pattern: /\S+@\S+\.\S+/,
        patternMessage: 'Некорректный формат email'
      },
      avatar_url: {
        pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i,
        patternMessage: 'Введите корректный URL изображения'
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validate()) return;
    
    try {
      const dataToSend = { ...formData, password: 'defaultPassword123' };
      
      if (user) {
        await dispatch(updateUser({ id: user.id, data: dataToSend })).unwrap();
      } else {
        await dispatch(createUser(dataToSend)).unwrap();
      }
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при сохранении');
    }
  };

  const roleOptions = [
    { value: 'traveler', label: 'Путешественник' },
    { value: 'admin', label: 'Администратор' }
  ];

  return (
    <FormContainer 
      title={user ? 'Редактировать пользователя' : 'Создать пользователя'}
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
        label="Имя"
        value={formData.name}
        onChange={handleChange('name')}
        error={errors.name}
        required
      />
      
      <FormField
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        required
      />
      
      <FormField
        type="select"
        label="Роль"
        value={formData.role}
        onChange={handleChange('role')}
        options={roleOptions}
      />
      
      <ImageField
        label="URL аватара"
        value={formData.avatar_url}
        onChange={handleChange('avatar_url')}
        error={errors.avatar_url}
      />
      
      <FormActions
        onCancel={onClose}
        onSubmit={handleSubmit}
        submitLabel={user ? 'Обновить' : 'Создать'}
      />
    </FormContainer>
  );
};

export default UserForm;