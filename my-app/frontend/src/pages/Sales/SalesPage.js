import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales, removeSale } from '../../store/slices/saleSlice';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import SearchSortBar from '../../components/SearchSortBar';
import { toast } from 'react-toastify';
import ExportButton from '../../components/ExportButton';

const SalesPage = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.sales);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('saleDate');
  const [order, setOrder] = useState('DESC');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchSales({ page, limit: 10, sort, order, search }));
  }, [dispatch, page, sort, order, search]);

  const handleDelete = (id) => {
    if (window.confirm('Удалить продажу?')) {
      dispatch(removeSale(id))
        .unwrap()
        .then(() => toast.success('Продажа удалена'))
        .catch(() => toast.error('Ошибка удаления'));
    }
  };

  const handlePageChange = (_, value) => setPage(value);

  const formatExtraServices = (extraServices) => {
    if (!extraServices) return '0';
    
    try {
      const services = typeof extraServices === 'string' 
        ? JSON.parse(extraServices) 
        : extraServices;
      
      if (!Array.isArray(services) || services.length === 0) return '0';
      
      const totalCost = services.reduce((sum, service) => 
        sum + (parseFloat(service.price) || 0), 0
      );
      
      return `${services.length} ($${totalCost})`;
    } catch (error) {
      return '0';
    }
  };

  const columns = [
    { id: 'purpose', label: 'Цель' },
    { id: 'price', label: 'Цена ($)', render: (row) => `${row.price} $` },
    { id: 'quantity', label: 'Кол-во' },
    { id: 'customerName', label: 'Клиент' },
    { id: 'saleDate', label: 'Дата', render: (row) => new Date(row.saleDate).toLocaleDateString() },
    { id: 'status', label: 'Статус' },
    { 
      id: 'extraServices', 
      label: 'Доп. услуги', 
      render: (row) => formatExtraServices(row.extraServices)
    },
  ];

  const sortOptions = [
    { value: 'saleDate', label: 'По дате' },
    { value: 'price', label: 'По цене' },
    { value: 'customerName', label: 'По клиенту' },
  ];

  return (
    <>
      <PageHeader 
        title="Продажи" 
        addPath="/sales/new" 
        entityType="sales" 
      />

      <SearchSortBar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        order={order}
        onOrderChange={setOrder}
        sortOptions={sortOptions}
      />

      <DataTable
        columns={columns}
        data={list}
        total={total}
        page={page}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        basePath="/sales"
        loading={loading}
        entityType="sales" 
      />
      <ExportButton />
    </>
  );
};

export default SalesPage;