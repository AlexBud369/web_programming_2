import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRoute } from '../../store/slices/routeSlice';
import { fetchCountries } from '../../store/slices/countrySlice';
import EntityCard from '../../components/EntityCard';

const RouteDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.routes);
  const { list: countries } = useSelector((state) => state.countries);
  const [countryName, setCountryName] = useState('');

  useEffect(() => {
    dispatch(fetchRoute(id));
    dispatch(fetchCountries({ page: 1, limit: 100 }));
  }, [dispatch, id]);

  useEffect(() => {
    if (current && countries.length > 0) {
      const country = countries.find(c => c.id === current.countryId);
      if (country) {
        setCountryName(`${country.name} (${country.code})`);
      }
    }
  }, [current, countries]);

  const fields = [
    { key: 'code', label: 'Код маршрута' },
    { key: 'durationDays', label: 'Продолжительность (дней)' },
    { 
      key: 'price', 
      label: 'Цена ($)', 
      render: (val) => {
        const num = parseFloat(val);
        return `$${!isNaN(num) ? num.toFixed(2) : '0.00'}`;
      }
    },
    { key: 'isActive', label: 'Активен', render: (val) => val ? 'Да' : 'Нет' },
    { key: 'description', label: 'Описание' },
    { 
      key: 'countryId', 
      label: 'Страна',
      render: () => countryName || `ID: ${current?.countryId || 'не указан'}`
    },
  ];

  return (
    <EntityCard
      entity={current}
      titleField="name"
      imageField="imageUrl"
      fields={fields}
      basePath="/routes"
    />
  );
};

export default RouteDetail;