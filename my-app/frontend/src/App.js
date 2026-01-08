import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import { Container, CssBaseline } from '@mui/material';
import AppHeader from './components/AppHeader';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';

import CountriesPage from './pages/Countries/CountriesPage';
import CountryDetail from './pages/Countries/CountryDetail';
import CountryForm from './pages/Countries/CountryForm';
import RoutesPage from './pages/Routes/RoutesPage';
import RouteDetail from './pages/Routes/RouteDetail';
import RouteForm from './pages/Routes/RouteForm';
import SalesPage from './pages/Sales/SalesPage';
import SaleDetail from './pages/Sales/SaleDetail';
import SaleForm from './pages/Sales/SaleForm';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <CssBaseline />
      <AppHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Navigate to="/countries" />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          
          <Route path="/countries" element={
            <PrivateRoute>
              <CountriesPage />
            </PrivateRoute>
          } />
          
          <Route path="/countries/new" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <CountryForm />
            </RoleBasedRoute>
          } />
          
          <Route path="/countries/edit/:id" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <CountryForm />
            </RoleBasedRoute>
          } />
          
          <Route path="/countries/:id" element={
            <PrivateRoute>
              <CountryDetail />
            </PrivateRoute>
          } />
          
          <Route path="/routes" element={
            <PrivateRoute>
              <RoutesPage />
            </PrivateRoute>
          } />
          
          <Route path="/routes/new" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <RouteForm />
            </RoleBasedRoute>
          } />
          
          <Route path="/routes/edit/:id" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <RouteForm />
            </RoleBasedRoute>
          } />
          
          <Route path="/routes/:id" element={
            <PrivateRoute>
              <RouteDetail />
            </PrivateRoute>
          } />
          
          <Route path="/sales" element={
            <PrivateRoute>
              <SalesPage />
            </PrivateRoute>
          } />
          
          <Route path="/sales/new" element={
            <PrivateRoute>
              <SaleForm />
            </PrivateRoute>
          } />
          
          <Route path="/sales/edit/:id" element={
            <PrivateRoute>
              <SaleForm />
            </PrivateRoute>
          } />
          
          <Route path="/sales/:id" element={
            <PrivateRoute>
              <SaleDetail />
            </PrivateRoute>
          } />

          <Route path="/analytics" element={
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          } />
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route path="*" element={
            isAuthenticated ? 
              <Navigate to="/countries" /> : 
              <Navigate to="/login" />
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;