import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoutes, removeRoute } from '../../store/slices/routeSlice';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import SearchSortBar from '../../components/SearchSortBar';
import { toast } from 'react-toastify';

const RoutesPage = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.routes);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchRoutes({ page, limit: 10, sort, order, search }));
  }, [dispatch, page, sort, order, search]);

  const handleDelete = (id) => {
    if (window.confirm('Удалить маршрут?')) {
      dispatch(removeRoute(id))
        .unwrap()
        .then(() => toast.success('Маршрут удалён'))
        .catch(() => toast.error('Не удалось удалить (возможно, есть продажи)'));
    }
  };

  const handlePageChange = (_, value) => setPage(value);

  const columns = [
    { id: 'code', label: 'Код' },
    { id: 'name', label: 'Название' },
    { id: 'durationDays', label: 'Дней' },
    { id: 'price', label: 'Цена ($)', render: (row) => `$${row.price}` },
    { id: 'isActive', label: 'Активен', render: (row) => row.isActive ? 'Да' : 'Нет' },
  ];

  const sortOptions = [
    { value: 'name', label: 'По названию' },
    { value: 'price', label: 'По цене' },
    { value: 'durationDays', label: 'По длительности' },
    { value: 'createdAt', label: 'По дате создания' },
  ];

  return (
    <>
      <PageHeader title="Маршруты" addPath="/routes/new" />

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
        basePath="/routes"
        loading={loading}
      />
    </>
  );
};

export default RoutesPage;