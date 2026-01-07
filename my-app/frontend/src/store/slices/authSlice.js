import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService.js';

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Нет refresh token');
    
    const response = await authService.refreshToken(refreshToken);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.accessToken;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Login attempt:', email);
      const data = await authService.login(email, password);
      console.log('Login response:', data);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg || 
        'Ошибка входа'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Register attempt:', userData.email);
      const data = await authService.register(userData);
      console.log('Register response:', data);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error) {
      console.error('Register error details:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg || 
        'Ошибка регистрации'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return;
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.log('No access token found');
        return null;
      }
      
      try {
        const user = await authService.getProfile();
        console.log('User loaded:', user);
        return { user, accessToken };
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Access token expired, trying to refresh...');
          try {
            const newAccessToken = await refreshAccessToken();
            const user = await authService.getProfile();
            return { user, accessToken: newAccessToken };
          } catch (refreshError) {
            console.log('Refresh failed, clearing tokens');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error loading user:', error);
      return null; 
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null; 
      });
  }
});

export const { clearError, setTokens, updateUser } = authSlice.actions;
export default authSlice.reducer;