import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('reduxCart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return { items: [] };
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage().items,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      if (!item?.id || !item?.name || !item?.price) {
        state.error = 'Invalid product data';
        return;
      }

      const existingItem = state.items.find(i => i.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      
      state.error = null;
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      if (quantity < 0) {
        state.error = 'Quantity cannot be negative';
        return;
      }

      const item = state.items.find(i => i.id === id);
      
      if (item) {
        if (quantity === 0) {
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      state.error = null;
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(i => i.id !== id);
      state.error = null;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;

export const setupCartPersistence = (store) => {
  store.subscribe(() => {
    const cartState = store.getState().cart;
    try {
      localStorage.setItem('reduxCart', JSON.stringify(cartState));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  });
};