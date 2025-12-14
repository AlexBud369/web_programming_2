import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  FormHelperText 
} from '@mui/material';

const FormField = ({
  type = 'text',
  label,
  value,
  onChange,
  error,
  helperText,
  options = [],
  required = false,
  multiline = false,
  rows = 1,
  fullWidth = true,
  disabled = false,
  ...props
}) => {
  const commonProps = {
    label: required ? `${label} *` : label,
    value: value ?? '',
    onChange,
    error: !!error,
    helperText: error || helperText || undefined,
    fullWidth,
    disabled,
    ...props
  };

  if (type === 'select') {
    return (
      <FormControl fullWidth error={!!error} disabled={disabled}>
        <InputLabel>{required ? `${label} *` : label}</InputLabel>
        <Select {...commonProps} label={required ? `${label} *` : label}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {(error || helperText) && (
          <FormHelperText>{error || helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }

  if (type === 'number') {
    return (
      <TextField
        {...commonProps}
        type="number"
        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <TextField
        {...commonProps}
        multiline
        rows={rows}
      />
    );
  }

  return <TextField {...commonProps} type={type} />;
};

export default FormField;