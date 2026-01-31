import { 
  Paper, 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Stack
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const FiltersPanel = ({ filters, onFilterChange, onApply, onReset, loading }) => {
  return (
    <Paper sx={{ 
      p: { xs: 1.5, sm: 2 }, 
      mb: 3,
      borderRadius: 2
    }}>
      <Stack 
        spacing={{ xs: 1, sm: 2 }} 
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        flexWrap="wrap"
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1}
          sx={{ flexGrow: 1 }}
        >
          <TextField
            label="С даты"
            type="date"
            size="small"
            value={filters.fromDate}
            onChange={e => onFilterChange('fromDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '100%', sm: 150 } }}
          />
          <TextField
            label="По дату"
            type="date"
            size="small"
            value={filters.toDate}
            onChange={e => onFilterChange('toDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '100%', sm: 150 } }}
          />
        </Stack>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1}
          sx={{ flexGrow: 1 }}
        >
          <FormControl size="small" sx={{ width: { xs: '100%', sm: 140 } }}>
            <InputLabel>Группировка</InputLabel>
            <Select
              value={filters.groupBy}
              label="Группировка"
              onChange={e => onFilterChange('groupBy', e.target.value)}
            >
              <MenuItem value="day">По дням</MenuItem>
              <MenuItem value="week">По неделям</MenuItem>
              <MenuItem value="month">По месяцам</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ width: { xs: '100%', sm: 140 } }}>
            <InputLabel>Диаграмма</InputLabel>
            <Select
              value={filters.distributionBy}
              label="Диаграмма"
              onChange={e => onFilterChange('distributionBy', e.target.value)}
            >
              <MenuItem value="status">По статусам</MenuItem>
              <MenuItem value="route">По маршрутам</MenuItem>
              <MenuItem value="purpose">По целям</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack 
          direction={{ xs: 'row', sm: 'row' }} 
          spacing={1}
          justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button 
            variant="contained" 
            onClick={onApply}
            disabled={loading}
            startIcon={<FilterListIcon />}
            size="small"
            sx={{ width: { xs: '48%', sm: 'auto' } }}
          >
            Применить
          </Button>
          <Button 
            variant="outlined" 
            onClick={onReset}
            disabled={loading}
            size="small"
            sx={{ width: { xs: '48%', sm: 'auto' } }}
          >
            Сбросить
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FiltersPanel;