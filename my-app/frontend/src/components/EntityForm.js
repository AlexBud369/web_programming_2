import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const EntityForm = ({
  title,
  fields,
  onSubmit,
  register,
  errors,
  isEdit = false,
  onCancel,
  loading = false,
  isSelectSupported = false,
  watch
}) => {
  const formValues = watch ? watch() : {};

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {fields.map((field) => (
          <Box key={field.name}>
            {field.type === 'select' && isSelectSupported ? (
              <FormControl fullWidth error={!!errors[field.name]}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  label={field.label}
                  {...register(field.name, field.validation)}
                  value={formValues[field.name] || ''}
                  disabled={loading}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors[field.name] && (
                  <Typography variant="caption" color="error">
                    {errors[field.name].message}
                  </Typography>
                )}
                {field.helperText && (
                  <Typography variant="caption" color="textSecondary">
                    {field.helperText}
                  </Typography>
                )}
              </FormControl>
            ) : (
              <TextField
                label={field.label}
                type={field.type || 'text'}
                multiline={field.multiline}
                rows={field.rows}
                {...register(field.name, field.validation)}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message || field.helperText || ''}
                fullWidth
                variant="outlined"
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </Box>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ minWidth: 120 }}
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
            size="large"
          >
            Отмена
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EntityForm;