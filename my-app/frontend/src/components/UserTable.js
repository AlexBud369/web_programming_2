import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  TablePagination,
  Button,
  Typography,
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

const UserTable = ({ 
  data, 
  columns, 
  loading,
}) => {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);

  const tableColumns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 50,
    },
    ...columns.map(col => ({
      accessorKey: col.id,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              fontWeight: 'bold',
              '&:hover': { color: 'primary.main' }
            }}
            onClick={column.getToggleSortingHandler()}
          >
            {col.label}
            {sorted === 'asc' ? (
              <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
            ) : sorted === 'desc' ? (
              <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
            ) : null}
          </Box>
        );
      },
      cell: col.render ? 
        (info) => col.render(info.row.original) : 
        (info) => info.getValue(),
    })),
  ], [columns]);

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id.toString(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleExportSelected = () => {
    const selectedUsers = table.getSelectedRowModel().rows.map(row => row.original);
    if (selectedUsers.length === 0) return;
    
    const headers = ['ID', 'ФИО', 'Email', 'Роль', 'Статус', 'Последний вход'];
    const csvRows = selectedUsers.map(user => [
      user.id,
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.role === 'admin' ? 'Администратор' : 'Пользователь',
      user.isActive ? 'Активен' : 'Неактивен',
      user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ru-RU') : 'Никогда'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setRowSelection({});
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        Загрузка данных...
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {Object.keys(rowSelection).length > 0 && (
        <Box sx={{ 
          p: 2, 
          bgcolor: 'primary.lighter', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Выбрано записей: {Object.keys(rowSelection).length}
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            onClick={handleExportSelected}
          >
            Экспорт выбранных (CSV)
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => setRowSelection({})}
          >
            Снять выделение
          </Button>
        </Box>
      )}

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell 
                    key={header.id} 
                    sx={{ 
                      fontWeight: 'bold', 
                      bgcolor: 'background.paper',
                      width: header.column.columnDef.size || 'auto',
                      position: header.column.id === 'select' ? 'sticky' : 'static',
                      left: header.column.id === 'select' ? 0 : undefined,
                      zIndex: header.column.id === 'select' ? 3 : 1,
                      borderRight: header.column.id === 'select' ? 1 : 0,
                      borderColor: 'divider'
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow 
                  key={row.id} 
                  hover 
                  selected={row.getIsSelected()}
                  sx={{ 
                    '&:hover': { bgcolor: 'action.hover' },
                    '&.Mui-selected': { 
                      bgcolor: 'primary.lighter',
                      '&:hover': { bgcolor: 'primary.light' }
                    }
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell 
                      key={cell.id}
                      sx={{
                        position: cell.column.id === 'select' ? 'sticky' : 'static',
                        left: cell.column.id === 'select' ? 0 : undefined,
                        zIndex: cell.column.id === 'select' ? 2 : 1,
                        bgcolor: cell.row.getIsSelected() ? 'primary.lighter' : 'background.paper',
                        borderRight: cell.column.id === 'select' ? 1 : 0,
                        borderColor: 'divider'
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} align="center" sx={{ py: 3 }}>
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={table.getRowCount()}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} из ${count}`
        }
      />
    </Paper>
  );
};

export default UserTable;