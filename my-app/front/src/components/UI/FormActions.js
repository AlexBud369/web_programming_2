import { Button, Box } from '@mui/material';

const FormActions = ({ 
  onCancel, 
  onSubmit, 
  submitLabel = 'Сохранить', 
  cancelLabel = 'Отмена',
  submitDisabled = false,
  sx = {} 
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, ...sx }}>
      <Button onClick={onCancel} variant="outlined">
        {cancelLabel}
      </Button>
      <Button 
        onClick={onSubmit} 
        variant="contained" 
        disabled={submitDisabled}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};

export default FormActions;