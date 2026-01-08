import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const AnalyticsCard = ({ title, value, subtext, color = 'primary' }) => {
  const colorMap = {
    primary: '#1976d2',
    secondary: '#9c27b0',
    success: '#2e7d32',
    warning: '#ed6c02',
    error: '#d32f2f'
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            color: colorMap[color],
            fontWeight: 'bold'
          }}
        >
          {value}
        </Typography>
        {subtext && (
          <Typography variant="body2" color="textSecondary">
            {subtext}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;