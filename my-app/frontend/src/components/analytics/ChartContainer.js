import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const ChartContainer = ({ title, children, height = 400 }) => {
  const getHeight = () => {
    if (typeof height === 'object') {
      return height;
    }
    return height;
  };

  return (
    <Paper sx={{ 
      p: { xs: 1, sm: 1.5, md: 2 }, 
      height: getHeight(),
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: 1
    }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          flexShrink: 0,
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
          fontWeight: 'bold'
        }}
      >
        {title}
      </Typography>
      <Box sx={{ 
        flexGrow: 1, 
        minHeight: 0,
        position: 'relative'
      }}>
        {children}
      </Box>
    </Paper>
  );
};

export default ChartContainer;