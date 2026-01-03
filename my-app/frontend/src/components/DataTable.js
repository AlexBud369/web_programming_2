import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Pagination,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const DataTable = ({
  columns,
  data,
  total,
  page,
  onPageChange,
  onDelete,
  basePath, 
  loading,
}) => {
  if (loading) return <p>Загрузка...</p>;

  const totalPages = Math.ceil(total / 10); 

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.render ? col.render(row) : row[col.id]}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <IconButton component={Link} to={`${basePath}/${row.id}`}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton component={Link} to={`${basePath}/edit/${row.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(row.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={onPageChange} color="primary" />
        </Box>
      )}
    </>
  );
};

export default DataTable;