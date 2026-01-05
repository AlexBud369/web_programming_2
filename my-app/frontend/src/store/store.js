import { configureStore } from '@reduxjs/toolkit';
import countryReducer from './slices/countrySlice';
import routeReducer from './slices/routeSlice';
import saleReducer from './slices/saleSlice';

const store = configureStore({
  reducer: {
    countries: countryReducer,
    routes: routeReducer,
    sales: saleReducer,
  }
});

export default store;