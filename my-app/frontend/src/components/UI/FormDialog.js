import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const FormDialog = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;