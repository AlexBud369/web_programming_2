import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './Slices/productsSlice.js';
import cartReducer from './Slices/cartSlice.js';

const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
    },
});

export default store;