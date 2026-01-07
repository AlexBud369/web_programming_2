import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { fetchSale } from '../../store/slices/saleSlice';
import EntityCard from '../../components/EntityCard';

const SaleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { current, loading } = useSelector((state) => state.sales);

  useEffect(() => {
    if (id && !isNaN(parseInt(id))) {
      dispatch(fetchSale(id));
    } else {
      navigate('/sales');
    }
  }, [dispatch, id, navigate]);

  if (loading) return <p>Загрузка...</p>;
  if (!current) return <p>Продажа не найдена</p>;

  const fields = [
    { key: 'purpose', label: 'Цель поездки' },
    { key: 'price', label: 'Цена ($)', render: (val) => `${val} $` },
    { key: 'quantity', label: 'Количество человек' },
    { key: 'saleDate', label: 'Дата продажи', render: (val) => new Date(val).toLocaleDateString('ru-RU') },
    { key: 'customerName', label: 'Имя клиента' },
    { key: 'customerEmail', label: 'Email клиента' },
    { key: 'status', label: 'Статус' },
    { key: 'routeId', label: 'ID маршрута' },
    { key: 'createdBy', label: 'Создано пользователем', render: (val) => `ID: ${val || 'Нет данных'}` },
  ];

  return (
    <EntityCard
      entity={current}
      titleField="customerName"
      fields={fields}
      basePath="/sales"
      entityType="sales"
    />
  );
};

export default SaleDetail;