import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import countryReducer from './slices/countrySlice';
import routeReducer from './slices/routeSlice';
import saleReducer from './slices/saleSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    countries: countryReducer,
    routes: routeReducer,
    sales: saleReducer,
    users: userReducer
  }
});

export default store;