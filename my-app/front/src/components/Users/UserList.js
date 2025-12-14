import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, Alert, Avatar, Chip } from '@mui/material';
import { Person } from '@mui/icons-material';
import { fetchUsers, deleteUser } from '../../store/slices/usersSlice';
import DataTable from '../UI/DataTable';
import SearchFilter from '../UI/SearchFilter';
import PageHeader from '../UI/PageHeader';
import DeleteDialog from '../UI/DeleteDialog';
import FormDialog from '../UI/FormDialog';
import UserForm from './UserForm';
import useList from '../../hooks/useList';

const UserList = () => {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector(state => state.users);
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
    dispatch(fetchUsers());
  }, [dispatch]);

  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter(user => {
    const name = user?.name || '';
    const email = user?.email || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    { field: 'id', header: 'ID' },
    {
      field: 'avatar_url',
      header: 'Аватар',
      render: (value) => (
        <Avatar src={value} alt="avatar" />
      )
    },
    { field: 'name', header: 'Имя' },
    { field: 'email', header: 'Email' },
    {
      field: 'role',
      header: 'Роль',
      render: (value) => (
        <Chip 
          label={value === 'admin' ? 'Администратор' : 'Путешественник'} 
          color={value === 'admin' ? 'secondary' : 'primary'}
          size="small"
        />
      )
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <PageHeader
        title="Пользователи"
        buttonText="Добавить пользователя"
        onButtonClick={handleCreate}
        icon={<Person />}
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        placeholder="Поиск по имени или email..."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        detailPath="/users"
        emptyMessage="Пользователи не найдены"
      />

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title={editingItem ? 'Редактировать пользователя' : 'Добавить пользователя'}
      >
        <UserForm
          user={editingItem}
          onClose={handleCloseForm}
        />
      </FormDialog>

      <DeleteDialog
        open={!!deleteConfirm}
        onClose={() => handleDelete(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            dispatch(deleteUser(deleteConfirm.id));
            handleDelete(null);
          }
        }}
        itemName={deleteConfirm?.name || ''}
      />
    </Paper>
  );
};

export default UserList;