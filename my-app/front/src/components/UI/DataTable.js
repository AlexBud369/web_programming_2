import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, IconButton, Button
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const DataTable = ({
  columns,
  data,
  loading,
  emptyMessage = 'Данные не найдены',
  onEdit,
  onDelete,
  detailPath = '/'
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="body1">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align || 'left'}>
                {column.header}
              </TableCell>
            ))}
            <TableCell align="center">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex} hover>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} align={column.align || 'left'}>
                  {column.render ? column.render(row[column.field], row) : row[column.field]}
                </TableCell>
              ))}
              <TableCell align="center">
                {onEdit && (
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(row)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton
                    color="error"
                    onClick={() => onDelete(row)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                )}
                <Button
                  component={Link}
                  to={`${detailPath}/${row.id}`}
                  size="small"
                  startIcon={<Visibility />}
                  sx={{ ml: 1 }}
                >
                  Подробнее
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;