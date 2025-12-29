import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, Alert, Chip, Card, CardContent, Grid } from '@mui/material';
import { CalendarToday, AttachMoney } from '@mui/icons-material';
import { fetchTrips, deleteTrip } from '../../store/slices/tripsSlice';
import DataTable from '../UI/DataTable';
import SearchFilter from '../UI/SearchFilter';
import PageHeader from '../UI/PageHeader';
import DeleteDialog from '../UI/DeleteDialog';
import FormDialog from '../UI/FormDialog';
import TripForm from './TripForm';
import useList from '../../hooks/useList';

const TripList = () => {
  const dispatch = useDispatch();
  const { items: trips, loading, error } = useSelector(state => state.trips);
  const {
    openForm,
    editingItem,
    deleteConfirm,
    searchTerm,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseForm,
    handleSearch
  } = useList();

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const safeTrips = Array.isArray(trips) ? trips : [];

  const filteredTrips = safeTrips.filter(trip => {
    const title = trip?.title || '';
    const description = trip?.description || '';
    const userName = trip?.user?.name || '';
    
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'planned': return 'Запланирована';
      case 'active': return 'Активна';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return status || 'Не указан';
    }
  };

  const columns = [
    { field: 'id', header: 'ID' },
    { field: 'title', header: 'Название' },
    {
      field: 'dates',
      header: 'Даты',
      render: (_, row) => (
        <Box>
          <Box>{row.start_date ? new Date(row.start_date).toLocaleDateString() : 'Не указано'}</Box>
          <Box sx={{ color: 'text.secondary' }}>
            до {row.end_date ? new Date(row.end_date).toLocaleDateString() : 'Не указано'}
          </Box>
        </Box>
      )
    },
    {
      field: 'total_budget',
      header: 'Бюджет',
      render: (value) => `$${parseFloat(value || 0).toFixed(2)}`
    },
    {
      field: 'status',
      header: 'Статус',
      render: (value) => (
        <Chip 
          label={getStatusText(value)}
          color={getStatusColor(value)}
          size="small"
        />
      )
    },
    {
      field: 'user',
      header: 'Пользователь',
      render: (value) => value?.name || 'Не указан'
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <PageHeader
        title="Поездки"
        buttonText="Добавить поездку"
        onButtonClick={handleCreate}
        icon={<CalendarToday />}
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        placeholder="Поиск по названию, описанию или пользователю..."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredTrips}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        detailPath="/trips"
        emptyMessage="Поездки не найдены"
      />

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title={editingItem ? 'Редактировать поездку' : 'Добавить поездку'}
      >
        <TripForm
          trip={editingItem}
          onClose={handleCloseForm}
        />
      </FormDialog>

      <DeleteDialog
        open={!!deleteConfirm}
        onClose={() => handleDelete(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            dispatch(deleteTrip(deleteConfirm.id));
            handleDelete(null);
          }
        }}
        itemName={deleteConfirm?.title || ''}
        warning={
          deleteConfirm?.destinations_count > 0 
            ? `Внимание: у этой поездки есть ${deleteConfirm.destinations_count} направлений, которые также будут удалены.`
            : null
        }
      />
    </Paper>
  );
};

export default TripList;