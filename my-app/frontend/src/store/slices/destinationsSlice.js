import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { destinationsAPI } from '../../services/api';

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchDestinations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await destinationsAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка загрузки направлений');
    }
  }
);

export const fetchDestinationById = createAsyncThunk(
  'destinations/fetchDestinationById',
  async (id, { rejectWithValue }) => {
    if (!id || id === 'undefined') {
      return rejectWithValue('ID направления не указан');
    }
    try {
      const response = await destinationsAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Направление не найдено');
    }
  }
);

export const createDestination = createAsyncThunk(
  'destinations/createDestination',
  async (destinationData, { rejectWithValue }) => {
    try {
      const response = await destinationsAPI.create(destinationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка создания направления');
    }
  }
);

export const updateDestination = createAsyncThunk(
  'destinations/updateDestination',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await destinationsAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка обновления направления');
    }
  }
);

export const deleteDestination = createAsyncThunk(
  'destinations/deleteDestination',
  async (id, { rejectWithValue }) => {
    try {
      await destinationsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Не удалось удалить направление');
    }
  }
);

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState: {
    items: [],
    currentDestination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDestination: (state) => {
      state.currentDestination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchDestinationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDestination = action.payload;
      })
      .addCase(fetchDestinationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createDestination.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      
      .addCase(updateDestination.fulfilled, (state, action) => {
        const index = state.items.findIndex(dest => dest.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentDestination?.id === action.payload.id) {
          state.currentDestination = action.payload;
        }
      })
      
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.items = state.items.filter(dest => dest.id !== action.payload);
        if (state.currentDestination?.id === action.payload) {
          state.currentDestination = null;
        }
      });
  },
});

export const { clearError, clearCurrentDestination } = destinationsSlice.actions;
export default destinationsSlice.reducer;