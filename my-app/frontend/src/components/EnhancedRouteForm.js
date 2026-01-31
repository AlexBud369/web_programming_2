import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Box, TextField, Button, FormControl, InputLabel, 
  Select, MenuItem, Typography, CircularProgress 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { getCountryById } from '../services/countryService';

const routeSchema = z.object({
  code: z.string()
    .min(2, 'Минимум 2 символа')
    .max(10, 'Максимум 10 символов')
    .regex(/^[A-Z0-9]+$/, 'Только заглавные буквы и цифры'),
  name: z.string()
    .min(3, 'Минимум 3 символа')
    .max(200, 'Максимум 200 символов'),
  durationDays: z.number()
    .min(1, 'Не менее 1 дня')
    .max(365, 'Не более 365 дней'),
  price: z.number()
    .min(0, 'Цена не может быть отрицательной')
    .max(1000000, 'Цена слишком большая'),
  countryId: z.number().min(1, 'Выберите страну'),
  isActive: z.boolean(),
  description: z.string()
    .max(10000, 'Максимум 10000 символов')
    .optional()
    .or(z.literal('')),
  imageUrl: z.string()
    .url('Некорректный URL')
    .optional()
    .or(z.literal('')),
  startSeasonDate: z.date().nullable().optional(),
  endSeasonDate: z.date().nullable().optional()
}).refine(
  (data) => {
    if (!data.startSeasonDate || !data.endSeasonDate) return true;
    return data.endSeasonDate >= data.startSeasonDate;
  },
  {
    message: 'Дата конца сезона должна быть после начала',
    path: ['endSeasonDate']
  }
);

const EnhancedRouteForm = ({ 
  isEdit, 
  currentData, 
  onSubmit, 
  onCancel, 
  loading, 
  countryOptions 
}) => {
  const [selectedCountryVisaCost, setSelectedCountryVisaCost] = useState(0);
  
  const { 
    control, 
    handleSubmit, 
    reset, 
    watch, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      code: '',
      name: '',
      durationDays: 1,
      price: 0,
      countryId: 0,
      isActive: true,
      description: '',
      imageUrl: '',
      startSeasonDate: null,
      endSeasonDate: null
    }
  });

  const countryId = watch('countryId');

  useEffect(() => {
    if (isEdit && currentData) {
      const formattedData = {
        ...currentData,
        durationDays: parseInt(currentData.durationDays) || 1,
        price: parseFloat(currentData.price) || 0,
        countryId: parseInt(currentData.countryId) || 0,
        isActive: !!currentData.isActive,
        startSeasonDate: currentData.startSeasonDate 
          ? parseISO(currentData.startSeasonDate) 
          : null,
        endSeasonDate: currentData.endSeasonDate 
          ? parseISO(currentData.endSeasonDate) 
          : null
      };
      
      if (formattedData.countryId) {
        fetchVisaCost(formattedData.countryId);
      }
      
      reset(formattedData);
    }
  }, [currentData, isEdit, reset]);

  useEffect(() => {
    if (countryId > 0) {
      fetchVisaCost(countryId);
    } else {
      setSelectedCountryVisaCost(0);
    }
  }, [countryId]);

  const fetchVisaCost = async (countryId) => {
    try {
      const country = await getCountryById(countryId);
      setSelectedCountryVisaCost(parseFloat(country.visaCost) || 0);
    } catch (error) {
      console.error('Ошибка загрузки стоимости визы:', error);
      toast.error('Ошибка загрузки стоимости визы');
      setSelectedCountryVisaCost(0);
    }
  };

  const submitHandler = (data) => {
    const formattedData = {
      ...data,
      startSeasonDate: data.startSeasonDate 
        ? format(data.startSeasonDate, 'yyyy-MM-dd') 
        : null,
      endSeasonDate: data.endSeasonDate 
        ? format(data.endSeasonDate, 'yyyy-MM-dd') 
        : null
    };
    onSubmit(formattedData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
        component="form" 
        onSubmit={handleSubmit(submitHandler)} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          p: 2 
        }}
      >
        <Controller 
          name="code"
          control={control}
          render={({ field }) => (
            <TextField 
              label="Код маршрута"
              {...field}
              error={!!errors.code}
              helperText={errors.code?.message}
              fullWidth
              required
            />
          )}
        />

        <Controller 
          name="name"
          control={control}
          render={({ field }) => (
            <TextField 
              label="Название маршрута"
              {...field}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              required
            />
          )}
        />

        <Controller 
          name="durationDays"
          control={control}
          render={({ field }) => (
            <TextField 
              label="Длительность (дней)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              error={!!errors.durationDays}
              helperText={errors.durationDays?.message}
              fullWidth
              required
            />
          )}
        />

        <Controller 
          name="price"
          control={control}
          render={({ field }) => (
            <TextField 
              label="Цена ($)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              error={!!errors.price}
              helperText={errors.price?.message}
              fullWidth
              required
            />
          )}
        />

        <FormControl fullWidth error={!!errors.countryId}>
          <InputLabel required>Страна</InputLabel>
          <Controller 
            name="countryId"
            control={control}
            render={({ field }) => (
              <Select 
                {...field}
                label="Страна"
              >
                <MenuItem value={0}>Выберите страну</MenuItem>
                {countryOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.countryId && (
            <Typography variant="caption" color="error">
              {errors.countryId.message}
            </Typography>
          )}
        </FormControl>

        <TextField 
          label="Стоимость визы ($)"
          value={selectedCountryVisaCost}
          disabled
          InputProps={{ readOnly: true }}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Статус</InputLabel>
          <Controller 
            name="isActive"
            control={control}
            render={({ field }) => (
              <Select 
                {...field}
                label="Статус"
              >
                <MenuItem value={true}>Активный</MenuItem>
                <MenuItem value={false}>Неактивный</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <Controller 
          name="description"
          control={control}
          render={({ field }) => (
            <TextField 
              label="Описание"
              multiline
              rows={4}
              {...field}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
          )}
        />

        <Controller 
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <TextField 
              label="URL изображения"
              {...field}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
              fullWidth
            />
          )}
        />

        <Controller 
          name="startSeasonDate"
          control={control}
          render={({ field }) => (
            <DatePicker 
              label="Дата начала сезона"
              value={field.value}
              onChange={field.onChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth
                  error={!!errors.startSeasonDate}
                  helperText={errors.startSeasonDate?.message}
                />
              )}
            />
          )}
        />

        <Controller 
          name="endSeasonDate"
          control={control}
          render={({ field }) => (
            <DatePicker 
              label="Дата конца сезона"
              value={field.value}
              onChange={field.onChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth
                  error={!!errors.endSeasonDate}
                  helperText={errors.endSeasonDate?.message}
                />
              )}
            />
          )}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEdit ? (
              'Сохранить'
            ) : (
              'Добавить'
            )}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onCancel} 
            disabled={loading}
            sx={{ flex: 1 }}
          >
            Отмена
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default EnhancedRouteForm;