import {
  Box,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller } from 'react-hook-form';

const Step2CustomerInfo = ({ control, errors }) => {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Controller
        name="customerName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Имя клиента *"
            error={!!errors.customerName}
            helperText={errors.customerName?.message}
            fullWidth
            value={field.value || ''}
          />
        )}
      />

      <Controller
        name="customerEmail"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email клиента *"
            type="email"
            error={!!errors.customerEmail}
            helperText={errors.customerEmail?.message}
            fullWidth
            value={field.value || ''}
            onKeyDown={handleKeyDown} 
          />
        )}
      />

      <Controller
        name="saleDate"
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Дата продажи *"
              value={field.value}
              onChange={field.onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.saleDate}
                  helperText={errors.saleDate?.message}
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>
        )}
      />

      <Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Количество человек *"
            type="number"
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
            fullWidth
            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
            inputProps={{ min: 1 }}
            value={field.value || 1}
            onKeyDown={handleKeyDown} 
          />
        )}
      />
    </Box>
  );
};

export default Step2CustomerInfo;