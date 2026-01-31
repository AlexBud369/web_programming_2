import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoutes } from '../store/slices/routeSlice';
import { checkRouteExists } from '../services/routeService';
import Step1RouteAndPurpose from './sale-form-steps/Step1RouteAndPurpose';
import Step2CustomerInfo from './sale-form-steps/Step2CustomerInfo';
import Step3ExtraServices from './sale-form-steps/Step3ExtraServices';

const extraServiceSchema = z.object({
  name: z.string().optional(),
  price: z.number().min(0, 'Цена не может быть отрицательной').optional()
});

const saleFormSchema = z.object({
  routeId: z.union([
    z.string().min(1, 'Выберите маршрут'),
    z.number().min(1, 'Выберите маршрут')
  ]).refine(val => val, 'Выберите маршрут'),
  purpose: z.string().min(1, 'Цель поездки обязательна'),
  
  customerName: z.string().min(1, 'Имя клиента обязательно').max(200),
  customerEmail: z.string().email('Некорректный email').max(100),
  saleDate: z.date(),
  quantity: z.number().int().positive('Количество должно быть положительным'),
  
  status: z.string().min(1, 'Статус обязателен'),
  extraServices: z.array(extraServiceSchema).optional()
});

const EnhancedSaleForm = ({ onSubmit, isEdit, initialData, loading, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRouteValidating, setIsRouteValidating] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [formattedRouteOptions, setFormattedRouteOptions] = useState([]);
  
  const dispatch = useDispatch();
  const { list: routes, loading: routesLoading } = useSelector((state) => state.routes);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(saleFormSchema),
    mode: 'onChange',
    shouldUnregister: false
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'extraServices'
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        routeId: '',
        purpose: '',
        customerName: '',
        customerEmail: '',
        saleDate: new Date(),
        quantity: 1,
        status: 'confirmed',
        extraServices: []
      });
    }
  }, [initialData, reset]);

  const watchRouteId = watch('routeId');
  const watchPurpose = watch('purpose');
  const watchCustomerName = watch('customerName');
  const watchCustomerEmail = watch('customerEmail');
  const watchQuantity = watch('quantity');
  const watchSaleDate = watch('saleDate');
  const watchStatus = watch('status');
  const watchExtraServices = watch('extraServices');

  useEffect(() => {
    dispatch(fetchRoutes({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (routes && routes.length > 0) {
      const options = routes.map(route => {
        const routeData = route.data || route;
        const price = parseFloat(routeData.price) || 0;
        
        return {
          value: routeData.id,
          label: `${routeData.code || ''} - ${routeData.name} (${price.toFixed(2)}$)`,
          price: price,
          rawData: routeData
        };
      });
      
      setFormattedRouteOptions(options);
    }
  }, [routes]);

  useEffect(() => {
    const validateRoute = async () => {
      if (watchRouteId) {
        setIsRouteValidating(true);
        setRouteError('');
        try {
          const routeId = typeof watchRouteId === 'string' 
            ? parseInt(watchRouteId) 
            : watchRouteId;
          const exists = await checkRouteExists(routeId);
          if (!exists) {
            setRouteError('Выбранный маршрут не существует или недоступен');
          }
        } catch (error) {
          setRouteError('Ошибка проверки маршрута');
        } finally {
          setIsRouteValidating(false);
        }
      }
    };

    const timeoutId = setTimeout(validateRoute, 500);
    return () => clearTimeout(timeoutId);
  }, [watchRouteId]);

  const steps = ['Выбор маршрута', 'Данные клиента', 'Дополнительные услуги'];

  const handleNext = async () => {
    let isValid = false;
    
    switch (activeStep) {
      case 0:
        isValid = await trigger(['routeId', 'purpose']);
        break;
      case 1:
        isValid = await trigger(['customerName', 'customerEmail', 'saleDate', 'quantity']);
        break;
      case 2:
        isValid = await trigger(['status']);
        break;
    }

    if (isValid && !routeError) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateTotal = () => {
    if (!watchRouteId) return 0;
    
    const selectedRoute = formattedRouteOptions.find(r => {
      const routeValue = r.value;
      const selectedValue = watchRouteId;
      return String(routeValue) === String(selectedValue);
    });
    
    const basePrice = selectedRoute ? Number(selectedRoute.price) : 0;
    const extrasTotal = (watchExtraServices || []).reduce((sum, service) => 
      sum + (Number(service?.price) || 0), 0);
    const quantity = Number(watchQuantity) || 1;
    
    return (basePrice + extrasTotal) * quantity;
  };

  const isFormValid = () => {
    const hasRequiredFields = 
      !!watchRouteId && 
      !!watchPurpose && 
      !!watchCustomerName && 
      !!watchCustomerEmail && 
      !!watchQuantity && 
      !!watchStatus &&
      !!watchSaleDate;
    
    const hasNoErrors = 
      !errors.routeId && 
      !errors.purpose && 
      !errors.customerName && 
      !errors.customerEmail && 
      !errors.quantity && 
      !errors.status && 
      !errors.saleDate &&
      !routeError;
    
    return hasRequiredFields && hasNoErrors;
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

  const getCurrentStepValid = () => {
    switch (activeStep) {
      case 0:
        return !!watchRouteId && !!watchPurpose && !errors.routeId && !errors.purpose && !routeError;
      case 1:
        return !!watchCustomerName && !!watchCustomerEmail && !!watchQuantity && !!watchSaleDate &&
               !errors.customerName && !errors.customerEmail && !errors.quantity && !errors.saleDate;
      case 2:
        return !!watchStatus && !errors.status;
      default:
        return false;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step1RouteAndPurpose
            control={control}
            errors={errors}
            routeError={routeError}
            isRouteValidating={isRouteValidating}
            routesLoading={routesLoading}
            formattedRouteOptions={formattedRouteOptions}
            purposeOptions={purposeOptions}
          />
        );
      case 1:
        return (
          <Step2CustomerInfo
            control={control}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step3ExtraServices
            control={control}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
            calculateTotal={calculateTotal}
            statusOptions={statusOptions}
          />
        );
      default:
        return null;
    }
  };

  if (activeStep === steps.length - 1) {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Box>
              <Button
                onClick={onCancel}
                variant="outlined"
                sx={{ mr: 2 }}
                type="button"
              >
                Отмена
              </Button>
              <Button
                onClick={handleBack}
                variant="outlined"
                type="button"
              >
                Назад
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEdit ? (
                'Обновить продажу'
              ) : (
                'Создать продажу'
              )}
            </Button>
          </Box>
        </form>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div>
        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box>
            <Button
              onClick={onCancel}
              variant="outlined"
              sx={{ mr: 2 }}
              type="button"
            >
              Отмена
            </Button>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                type="button"
              >
                Назад
              </Button>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!getCurrentStepValid() || !!routeError}
            type="button"
          >
            Далее
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default EnhancedSaleForm;