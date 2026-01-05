import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import AppHeader from './components/AppHeader';

import CountriesPage from './pages/Countries/CountriesPage';
import CountryDetail from './pages/Countries/CountryDetail';
import CountryForm from './pages/Countries/CountryForm';

import RoutesPage from './pages/Routes/RoutesPage';
import RouteDetail from './pages/Routes/RouteDetail';
import RouteForm from './pages/Routes/RouteForm';

import SalesPage from './pages/Sales/SalesPage';
import SaleDetail from './pages/Sales/SaleDetail';
import SaleForm from './pages/Sales/SaleForm';

function App() {
  return (
    <Router>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<CountriesPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/add" element={<CountryForm />} />
          <Route path="/countries/edit/:id" element={<CountryForm />} />
          <Route path="/countries/:id" element={<CountryDetail />} />

          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/add" element={<RouteForm />} />
          <Route path="/routes/edit/:id" element={<RouteForm />} />
          <Route path="/routes/:id" element={<RouteDetail />} />

          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/add" element={<SaleForm />} />
          <Route path="/sales/edit/:id" element={<SaleForm />} />
          <Route path="/sales/:id" element={<SaleDetail />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;