import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, Alert, Avatar, Chip } from '@mui/material';
import { Place, CalendarToday } from '@mui/icons-material';
import { fetchDestinations, deleteDestination } from '../../store/slices/destinationsSlice';
import DataTable from '../UI/DataTable';
import SearchFilter from '../UI/SearchFilter';
import PageHeader from '../UI/PageHeader';
import DeleteDialog from '../UI/DeleteDialog';
import FormDialog from '../UI/FormDialog';
import DestinationForm from './DestinationForm';
import useList from '../../hooks/useList';

const DestinationList = () => {
  const dispatch = useDispatch();
  const { items: destinations, loading, error } = useSelector(state => state.destinations);
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
    dispatch(fetchDestinations());
  }, [dispatch]);

  const safeDestinations = Array.isArray(destinations) ? destinations : [];

  const filteredDestinations = safeDestinations.filter(destination => {
    if (!destination) return false; // Защита от undefined
    
    const name = destination.name || '';
    const location = destination.location || '';
    const tripTitle = destination.trip?.title || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tripTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    { field: 'id', header: 'ID' },
    {
      field: 'image_url',
      header: 'Изображение',
      render: (value) => (
        <Avatar 
          src={value} 
          alt="destination"
          sx={{ width: 56, height: 56 }}
          variant="rounded"
        />
      )
    },
    {
      field: 'name',
      header: 'Название',
      render: (value) => value || 'Без названия'
    },
    {
      field: 'location',
      header: 'Местоположение',
      render: (value) => value || '-'
    },
    {
      field: 'dates',
      header: 'Даты',
      render: (_, row) => (
        <Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday fontSize="small" />
            <Box>
              {row.arrival_date ? new Date(row.arrival_date).toLocaleDateString() : 'не указано'}
            </Box>
          </Box>
          <Box fontSize="0.875rem" color="text.secondary">
            до {row.departure_date ? new Date(row.departure_date).toLocaleDateString() : 'не указано'}
          </Box>
        </Box>
      )
    },
    {
      field: 'trip',
      header: 'Поездка',
      render: (value) => (
        value ? (
          <Chip 
            label={value.title}
            size="small"
            color="primary"
            variant="outlined"
          />
        ) : (
          <Box fontSize="0.875rem" color="text.secondary">
            Не указана
          </Box>
        )
      )
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <PageHeader
        title="Направления"
        buttonText="Добавить направление"
        onButtonClick={handleCreate}
        icon={<Place />}
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        placeholder="Поиск по названию или местоположению..."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredDestinations}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        detailPath="/destinations"
        emptyMessage="Направления не найдены"
      />

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title={editingItem ? 'Редактировать направление' : 'Добавить направление'}
      >
        <DestinationForm
          destination={editingItem}
          onClose={handleCloseForm}
        />
      </FormDialog>

      <DeleteDialog
        open={!!deleteConfirm}
        onClose={() => handleDelete(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            dispatch(deleteDestination(deleteConfirm.id));
            handleDelete(null);
          }
        }}
        itemName={deleteConfirm?.name || ''}
        warning="Внимание: если у этого направления есть связанные активности, они также будут удалены!"
      />
    </Paper>
  );
};

export default DestinationList;