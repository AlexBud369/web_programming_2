import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { Controller } from 'react-hook-form';

const Step1RouteAndPurpose = ({ 
  control, 
  errors, 
  routeError, 
  isRouteValidating, 
  routesLoading,
  formattedRouteOptions,
  purposeOptions 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Controller
        name="routeId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.routeId || !!routeError}>
            <InputLabel>Маршрут *</InputLabel>
            <Select
              {...field}
              label="Маршрут *"
              disabled={isRouteValidating || routesLoading}
              value={field.value || ''}
            >
              {formattedRouteOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(errors.routeId || routeError) && (
              <FormHelperText>
                {errors.routeId?.message || routeError}
              </FormHelperText>
            )}
            {isRouteValidating && (
              <FormHelperText>
                <CircularProgress size={14} sx={{ mr: 1 }} />
                Проверка маршрута...
              </FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="purpose"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.purpose}>
            <InputLabel>Цель поездки *</InputLabel>
            <Select 
              {...field} 
              label="Цель поездки *"
              value={field.value || ''}
              onKeyDown={handleKeyDown}
            >
              {purposeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.purpose && (
              <FormHelperText>{errors.purpose.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Box>
  );
};

export default Step1RouteAndPurpose;