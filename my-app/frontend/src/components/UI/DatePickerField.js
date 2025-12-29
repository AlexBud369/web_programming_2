import { TextField } from '@mui/material';

const DatePickerField = ({ 
  label, 
  value, 
  onChange, 
  error, 
  helperText,
  type = 'date',
  ...props 
}) => {
  const inputType = type === 'datetime' ? 'datetime-local' : 'date';
  
  return (
    <TextField
      label={label}
      type={inputType}
      value={value || ''}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      fullWidth
      InputLabelProps={{ shrink: true }}
      {...props}
    />
  );
};

export default DatePickerField;