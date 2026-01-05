import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRoutes, getRouteById, createRoute, updateRoute, deleteRoute } from '../../services/routeService';

export const fetchRoutes = createAsyncThunk(
  'routes/fetchRoutes',
  async (params, { rejectWithValue }) => {
    try {
      return await getRoutes(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addRoute = createAsyncThunk(
  'routes/addRoute',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createRoute(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRoute = createAsyncThunk(
  'routes/fetchRoute',
  async (id, { rejectWithValue }) => {
    try {
      return await getRouteById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editRoute = createAsyncThunk(
  'routes/editRoute',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateRoute(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeRoute = createAsyncThunk(
  'routes/removeRoute',
  async (id, { rejectWithValue }) => {
    try {
      await deleteRoute(id);
      return id;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.status,
        data: error.data,
        id: id
      });
    }
  }
);

const routeSlice = createSlice({
  name: 'routes',
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
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoute.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.list.push(action.payload.data);
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(addRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchRoute.fulfilled, (state, action) => {
        state.current = action.payload.data || action.payload;
      })
      
      .addCase(editRoute.fulfilled, (state, action) => {
        const index = state.list.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload.data || action.payload;
        }
      })
      
      .addCase(removeRoute.fulfilled, (state, action) => {
        state.list = state.list.filter(r => r.id !== action.payload);
      })
      .addCase(removeRoute.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = routeSlice.actions;
export default routeSlice.reducer;