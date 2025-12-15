import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activitiesAPI } from '../../services/api';

export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await activitiesAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка загрузки активностей');
    }
  }
);

export const fetchActivityById = createAsyncThunk(
  'activities/fetchActivityById',
  async (id, { rejectWithValue }) => {
    if (!id || id === 'undefined') {
      return rejectWithValue('ID активности не указан');
    }
    try {
      const response = await activitiesAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Активность не найдена');
    }
  }
);

export const createActivity = createAsyncThunk(
  'activities/createActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await activitiesAPI.create(activityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка создания активности');
    }
  }
);

export const updateActivity = createAsyncThunk(
  'activities/updateActivity',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await activitiesAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка обновления активности');
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'activities/deleteActivity',
  async (id, { rejectWithValue }) => {
    try {
      await activitiesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Не удалось удалить активность');
    }
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    items: [],
    currentActivity: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentActivity: (state) => {
      state.currentActivity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchActivityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentActivity = action.payload;
      })
      .addCase(fetchActivityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createActivity.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.items.findIndex(activity => activity.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentActivity?.id === action.payload.id) {
          state.currentActivity = action.payload;
        }
      })
      
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.items = state.items.filter(activity => activity.id !== action.payload);
        if (state.currentActivity?.id === action.payload) {
          state.currentActivity = null;
        }
      });
  },
});

export const { clearError, clearCurrentActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;