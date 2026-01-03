import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries, removeCountry } from '../../store/slices/countrySlice';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import SearchSortBar from '../../components/SearchSortBar';
import { toast } from 'react-toastify';

const CountriesPage = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.countries);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCountries({ page, limit: 10, sort, order, search }));
  }, [dispatch, page, sort, order, search]);

  const handleDelete = (id) => {
    if (window.confirm('Удалить страну?')) {
      dispatch(removeCountry(id))
        .unwrap()
        .then(() => toast.success('Удалено'))
        .catch(() => toast.error('Не удалось удалить (возможно, есть маршруты)'));
    }
  };

  const handlePageChange = (_, value) => setPage(value);

  const columns = [
    { id: 'code', label: 'Код' },
    { id: 'name', label: 'Название' },
    { id: 'visaCost', label: 'Виза ($)', render: (row) => `$${row.visaCost}` },
  ];

  const sortOptions = [
    { value: 'name', label: 'По названию' },
    { value: 'visaCost', label: 'По стоимости визы' },
    { value: 'createdAt', label: 'По дате создания' },
  ];

  return (
    <>
      <PageHeader title="Страны" addPath="/countries/add" />

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
        basePath="/countries"
        loading={loading}
      />
    </>
  );
};

export default CountriesPage;