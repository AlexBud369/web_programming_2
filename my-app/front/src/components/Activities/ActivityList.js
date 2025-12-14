import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, Alert, Avatar, Chip } from '@mui/material';
import { DirectionsRun, CalendarToday, AttachMoney, Place } from '@mui/icons-material';
import { fetchActivities, deleteActivity } from '../../store/slices/activitiesSlice';
import DataTable from '../UI/DataTable';
import SearchFilter from '../UI/SearchFilter';
import PageHeader from '../UI/PageHeader';
import DeleteDialog from '../UI/DeleteDialog';
import FormDialog from '../UI/FormDialog';
import ActivityForm from './ActivityForm';
import useList from '../../hooks/useList';

const ActivityList = () => {
  const dispatch = useDispatch();
  const { items: activities, loading, error } = useSelector(state => state.activities);
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
    dispatch(fetchActivities());
  }, [dispatch]);

  const safeActivities = Array.isArray(activities) ? activities : [];

  const filteredActivities = safeActivities.filter(activity => {
    const title = activity?.title || '';
    const description = activity?.description || '';
    const type = activity?.type || '';
    const destinationName = activity?.destination?.name || '';
    
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destinationName.toLowerCase().includes(searchTerm.toLowerCase())
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
          alt="activity"
          sx={{ width: 56, height: 56 }}
          variant="rounded"
        />
      )
    },
    {
      field: 'title',
      header: 'Название',
      render: (value, row) => (
        <Box>
          <Box fontWeight="medium">{value || 'Без названия'}</Box>
          {row.type && (
            <Chip 
              label={row.type}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          )}
          {row.description && (
            <Box fontSize="0.875rem" color="text.secondary" sx={{ mt: 0.5 }}>
              {row.description.substring(0, 50)}...
            </Box>
          )}
        </Box>
      )
    },
    {
      field: 'datetime',
      header: 'Дата и время',
      render: (value) => (
        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarToday fontSize="small" />
          <Box>
            {value ? new Date(value).toLocaleString() : 'не указано'}
          </Box>
        </Box>
      )
    },
    {
      field: 'cost',
      header: 'Стоимость',
      render: (value) => (
        <Box display="flex" alignItems="center" gap={0.5}>
          <AttachMoney fontSize="small" />
          <Box>${parseFloat(value || 0).toFixed(2)}</Box>
        </Box>
      )
    },
    {
      field: 'location',
      header: 'Местоположение',
      render: (value) => value || '-'
    },
    {
      field: 'destination',
      header: 'Направление',
      render: (value) => (
        value ? (
          <Chip 
            label={value.name}
            size="small"
            color="primary"
            variant="outlined"
          />
        ) : (
          <Box fontSize="0.875rem" color="text.secondary">
            Не указано
          </Box>
        )
      )
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <PageHeader
        title="Активности"
        buttonText="Добавить активность"
        onButtonClick={handleCreate}
        icon={<DirectionsRun />}
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        placeholder="Поиск по названию, описанию или типу..."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredActivities}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        detailPath="/activities"
        emptyMessage="Активности не найдены"
      />

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title={editingItem ? 'Редактировать активность' : 'Добавить активность'}
      >
        <ActivityForm
          activity={editingItem}
          onClose={handleCloseForm}
        />
      </FormDialog>

      <DeleteDialog
        open={!!deleteConfirm}
        onClose={() => handleDelete(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            dispatch(deleteActivity(deleteConfirm.id));
            handleDelete(null);
          }
        }}
        itemName={deleteConfirm?.title || ''}
      />
    </Paper>
  );
};

export default ActivityList;