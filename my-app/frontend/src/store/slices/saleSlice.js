import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSales, getSaleById, createSale, updateSale, deleteSale } from '../../services/saleService';

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getSales(params);
      return response.data || response; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addSale = createAsyncThunk(
  'sales/addSale',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createSale(data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSale = createAsyncThunk(
  'sales/fetchSale',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSaleById(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const editSale = createAsyncThunk(
  'sales/editSale',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateSale(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
      return rejectWithValue(error.response?.data?.message || error.message);
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
    },
    clearCurrent: (state) => {
      state.current = null;
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
        state.total = action.payload.total || action.payload.length || 0;
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
        const newSale = action.payload.data || action.payload;
        state.list.unshift(newSale); 
        state.total += 1;
      })
      .addCase(addSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSale.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data || action.payload;
      })
      .addCase(fetchSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(editSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editSale.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSale = action.payload.data || action.payload;
        const index = state.list.findIndex(s => s.id === updatedSale.id);
        if (index !== -1) {
          state.list[index] = updatedSale;
        }
        if (state.current?.id === updatedSale.id) {
          state.current = updatedSale;
        }
      })
      .addCase(editSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(removeSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSale.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(s => s.id !== action.payload);
        state.total -= 1;
      })
      .addCase(removeSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrent } = saleSlice.actions;
export default saleSlice.reducer;