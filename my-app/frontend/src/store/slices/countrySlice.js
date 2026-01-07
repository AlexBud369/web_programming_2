import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCountries, getCountryById, createCountry, updateCountry, deleteCountry } from '../../services/countryService';

export const fetchCountries = createAsyncThunk('countries/fetchCountries', async (params) => getCountries(params));
export const fetchCountry = createAsyncThunk('countries/fetchCountry', async (id) => getCountryById(id));
export const addCountry = createAsyncThunk('countries/addCountry', async (data) => createCountry(data));
export const editCountry = createAsyncThunk('countries/editCountry', async ({ id, data }) => updateCountry(id, data));
export const removeCountry = createAsyncThunk('countries/removeCountry', async (id) => deleteCountry(id));

const countrySlice = createSlice({
  name: 'countries',
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
      .addCase(fetchCountries.pending, (state) => { state.loading = true; })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCountry.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addCountry.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(addCountry.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(editCountry.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(editCountry.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(removeCountry.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.meta.arg);
      })
      .addCase(removeCountry.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { clearError } = countrySlice.actions;
export default countrySlice.reducer;