import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tripsAPI } from '../../services/api';

export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка загрузки поездок');
    }
  }
);

export const fetchTripById = createAsyncThunk(
  'trips/fetchTripById',
  async (id, { rejectWithValue }) => {
    if (!id || id === 'undefined') {
      return rejectWithValue('ID путешествия не указан');
    }
    try {
      const response = await tripsAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Поездка не найдена');
    }
  }
);

export const createTrip = createAsyncThunk(
  'trips/createTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.create(tripData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка создания поездки');
    }
  }
);

export const updateTrip = createAsyncThunk(
  'trips/updateTrip',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка обновления поездки');
    }
  }
);

export const deleteTrip = createAsyncThunk(
  'trips/deleteTrip',
  async (id, { rejectWithValue }) => {
    try {
      await tripsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Не удалось удалить поездку');
    }
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    items: [],
    currentTrip: null,
    loading: false,
    error: null,
    statistics: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createTrip.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.items.findIndex(trip => trip.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentTrip?.id === action.payload.id) {
          state.currentTrip = action.payload;
        }
      })
      
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.items = state.items.filter(trip => trip.id !== action.payload);
        if (state.currentTrip?.id === action.payload) {
          state.currentTrip = null;
        }
      });
  },
});

export const { clearError, clearCurrentTrip } = tripsSlice.actions;
export default tripsSlice.reducer;