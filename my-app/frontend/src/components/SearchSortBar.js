import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const SearchSortBar = ({ search, onSearchChange, sort, onSortChange, order, onOrderChange, sortOptions }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'end' }}>
      <TextField label="Поиск" value={search} onChange={(e) => onSearchChange(e.target.value)} size="small" />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Сортировка</InputLabel>
        <Select value={sort} onChange={(e) => onSortChange(e.target.value)} label="Сортировка">
          {sortOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Порядок</InputLabel>
        <Select value={order} onChange={(e) => onOrderChange(e.target.value)} label="Порядок">
          <MenuItem value="ASC">По возрастанию</MenuItem>
          <MenuItem value="DESC">По убыванию</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchSortBar;