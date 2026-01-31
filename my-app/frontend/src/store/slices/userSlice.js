import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  changeUserRole,
  bulkUpdateUserRoles 
} from '../../services/userService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await getUsers(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createUser(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (id, { rejectWithValue }) => {
    try {
      return await getUserById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editUser = createAsyncThunk(
  'users/editUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateUser(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await changeUserRole(id, role);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkUpdateRoles = createAsyncThunk(
  'users/bulkUpdateRoles',
  async (updates, { rejectWithValue }) => {
    try {
      const response = await bulkUpdateUserRoles(updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    current: null,
    total: 0,
    loading: false,
    error: null,
    selectedRows: []
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedRows: (state) => {
      state.selectedRows = [];
    },
    toggleRowSelection: (state, action) => {
      const id = action.payload;
      const index = state.selectedRows.indexOf(id);
      if (index === -1) {
        state.selectedRows.push(id);
      } else {
        state.selectedRows.splice(index, 1);
      }
    },
    selectAllRows: (state, action) => {
      const { ids, checked } = action.payload;
      if (checked) {
        state.selectedRows = [...ids];
      } else {
        state.selectedRows = [];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload.data || action.payload;
        state.list = Array.isArray(responseData) ? responseData : [];
        state.total = action.payload.total || state.list.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.list.push(action.payload.data);
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.current = action.payload.data || action.payload;
      })
      
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.list.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.data };
        }
      })
      
      .addCase(removeUser.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u.id !== action.payload);
        state.selectedRows = state.selectedRows.filter(id => id !== action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.list.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index].role = action.payload.role || action.payload.data?.role;
        }
      })
      
      .addCase(bulkUpdateRoles.fulfilled, (state, action) => {
        const updatedUsers = action.payload.updatedUsers || [];
        updatedUsers.forEach(updatedUser => {
          const index = state.list.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            state.list[index] = updatedUser;
          }
        });
      });
  }
});

export const { clearError, clearSelectedRows, toggleRowSelection, selectAllRows } = userSlice.actions;
export default userSlice.reducer;