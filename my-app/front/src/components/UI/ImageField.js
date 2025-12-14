import React from 'react';
import { Box } from '@mui/material';
import FormField from './FormField';

const ImageField = ({ 
  label, 
  value, 
  onChange, 
  error, 
  helperText,
  previewHeight = 200 
}) => {
  return (
    <>
      <FormField
        type="text"
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText || 'Ссылка на изображение (JPEG, PNG, GIF)'}
      />
      
      {value && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <img 
            src={value} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: `${previewHeight}px`, 
              objectFit: 'contain',
              borderRadius: '4px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Box>
      )}
    </>
  );
};

export default ImageField;