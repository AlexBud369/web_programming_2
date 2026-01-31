import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Paper,
  Typography,
  Alert,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Controller } from 'react-hook-form';

const Step3ExtraServices = ({ 
  control, 
  errors, 
  fields, 
  append, 
  remove, 
  calculateTotal,
  statusOptions 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Дополнительные услуги
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Добавьте дополнительные услуги для клиента (не обязательно)
        </Typography>
      </Box>

      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Controller
              name={`extraServices.${index}.name`}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label="Название услуги"
                  error={!!errors.extraServices?.[index]?.name}
                  helperText={errors.extraServices?.[index]?.name?.message}
                  sx={{ flex: 2 }}
                  value={controllerField.value || ''}
                />
              )}
            />

            <Controller
              name={`extraServices.${index}.price`}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label="Цена ($)"
                  type="number"
                  error={!!errors.extraServices?.[index]?.price}
                  helperText={errors.extraServices?.[index]?.price?.message}
                  sx={{ flex: 1 }}
                  onChange={(e) => controllerField.onChange(parseFloat(e.target.value) || 0)}
                  inputProps={{ min: 0, step: 0.01 }}
                  value={controllerField.value || 0}
                  onKeyDown={handleKeyDown} 
                />
              )}
            />

            <IconButton
              onClick={() => remove(index)}
              color="error"
              sx={{ mt: 1 }}
              type="button" 
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() => append({ name: '', price: 0 })}
        variant="outlined"
        sx={{ alignSelf: 'flex-start' }}
        type="button"
      >
        Добавить услугу
      </Button>

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Статус *</InputLabel>
            <Select 
              {...field} 
              label="Статус *"
              value={field.value || 'confirmed'}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.status && (
              <FormHelperText>{errors.status.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Итоговая сумма:</strong> ${calculateTotal().toFixed(2)}
        </Typography>
      </Alert>
    </Box>
  );
};

export default Step3ExtraServices;