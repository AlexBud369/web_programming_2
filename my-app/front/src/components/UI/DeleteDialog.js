import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from '@mui/material';

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Подтверждение удаления',
  itemName = '',
  warning = null
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>
          Вы уверены, что хотите удалить "{itemName}"?
        </Typography>
        {warning && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {warning}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;