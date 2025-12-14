import { useState } from 'react';

const useList = (initialFilters = {}) => {
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const handleCreate = () => {
    setEditingItem(null);
    setOpenForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setOpenForm(true);
  };

  const handleDelete = (item) => {
    setDeleteConfirm(item);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingItem(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      ...(field !== 'page' && { page: 1 }) 
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return {
    openForm,
    editingItem,
    deleteConfirm,
    searchTerm,
    filters,
    
    setOpenForm,
    setEditingItem,
    setDeleteConfirm,
    setSearchTerm,
    setFilters,
    
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseForm,
    handleSearch,
    handleFilterChange,
    handlePageChange
  };
};

export default useList;