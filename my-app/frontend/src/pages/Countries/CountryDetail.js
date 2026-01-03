import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCountry } from '../../store/slices/countrySlice';
import EntityCard from '../../components/EntityCard';

const CountryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading } = useSelector((state) => state.countries);

  useEffect(() => {
    dispatch(fetchCountry(id));
  }, [dispatch, id]);

  const fields = [
    { key: 'code', label: 'Код страны' },
    { key: 'visaCost', label: 'Стоимость визы' },
    { key: 'description', label: 'Описание' },
  ];

  return <EntityCard entity={current} fields={fields} basePath="/countries" imageField="flagImage" />;
};

export default CountryDetail;