import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales, removeSale } from '../../store/slices/saleSlice';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import SearchSortBar from '../../components/SearchSortBar';
import { toast } from 'react-toastify';

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

  const columns = [
    { id: 'purpose', label: 'Цель' },
    { id: 'price', label: 'Цена ($)' },
    { id: 'quantity', label: 'Кол-во' },
    { id: 'customerName', label: 'Клиент' },
    { id: 'saleDate', label: 'Дата', render: (row) => new Date(row.saleDate).toLocaleDateString() },
    { id: 'status', label: 'Статус' },
  ];

  const sortOptions = [
    { value: 'saleDate', label: 'По дате' },
    { value: 'price', label: 'По цене' },
    { value: 'customerName', label: 'По клиенту' },
  ];

  return (
    <>
      <PageHeader title="Продажи" addPath="/sales/add" />

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
      />
    </>
  );
};

export default SalesPage;