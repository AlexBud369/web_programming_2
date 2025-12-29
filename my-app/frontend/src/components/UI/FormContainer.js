import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const FormContainer = ({ title, subtitle, children, sx = {} }) => {
  return (
    <Paper sx={{ p: 3, ...sx }}>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default FormContainer;