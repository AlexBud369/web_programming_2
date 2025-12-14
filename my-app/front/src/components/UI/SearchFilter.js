import React from 'react';
import { TextField, Box, MenuItem } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Поиск...',
  filters = [],
  onFilterChange
}) => {
  return (
    <Box display="flex" gap={2} alignItems="center" mb={3}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />
      
      {filters.map((filter, index) => (
        <TextField
          key={index}
          select
          label={filter.label}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.field, e.target.value)}
          sx={{ minWidth: filter.minWidth || 150 }}
        >
          {filter.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ))}
    </Box>
  );
};

export default SearchFilter;