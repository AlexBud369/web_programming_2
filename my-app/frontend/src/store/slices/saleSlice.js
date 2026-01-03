import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSales, getSaleById, createSale, updateSale, deleteSale } from '../../services/saleService';

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (params, { rejectWithValue }) => {
    try {
      return await getSales(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSale = createAsyncThunk(
  'sales/addSale',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Adding sale in thunk:', data);
      const response = await createSale(data);
      return response;
    } catch (error) {
      console.error('Error in addSale thunk:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSale = createAsyncThunk(
  'sales/fetchSale',
  async (id, { rejectWithValue }) => {
    try {
      return await getSaleById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editSale = createAsyncThunk(
  'sales/editSale',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateSale(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeSale = createAsyncThunk(
  'sales/removeSale',
  async (id, { rejectWithValue }) => {
    try {
      await deleteSale(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const saleSlice = createSlice({
  name: 'sales',
  initialState: {
    list: [],
    current: null,
    total: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSale.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.list.push(action.payload.data);
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(addSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchSale.fulfilled, (state, action) => {
        state.current = action.payload.data || action.payload;
      })
      
      .addCase(editSale.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload.data || action.payload;
        }
      })
      
      .addCase(removeSale.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s.id !== action.payload);
      })
      .addCase(removeSale.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = saleSlice.actions;
export default saleSlice.reducer;