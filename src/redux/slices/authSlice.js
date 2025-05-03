import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const tokenKey = 'token';

const initialState = {
  token: localStorage.getItem(tokenKey),
  loading: false,
  error: null,
};

// LOGIN thunk
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      credentials
    );

    if (!res.data.token) throw new Error('No token returned');

    localStorage.setItem(tokenKey, res.data.token);
    return res.data.token;
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Login failed');
  }
});

// SIGNUP thunk
export const signup = createAsyncThunk('auth/signup', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/signup`,
      credentials
    );

    if (!res.data.token) throw new Error('No token returned');

    localStorage.setItem(tokenKey, res.data.token);
    return res.data.token;
  } catch (err) {
    console.error('Signup error:', err.response?.data || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Signup failed');
  }
});

// SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem(tokenKey);
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
