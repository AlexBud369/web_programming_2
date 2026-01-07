import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import countryReducer from './slices/countrySlice';
import routeReducer from './slices/routeSlice';
import saleReducer from './slices/saleSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    countries: countryReducer,
    routes: routeReducer,
    sales: saleReducer,
  }
});

export default store;