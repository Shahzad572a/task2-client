import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const tokenKey = 'token';
 
const initialState = {
  token: localStorage.getItem(tokenKey),
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      localStorage.setItem(tokenKey, res.data.token);
      return res.data.token;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Login failed');
    }
  });
  
  export const signup = createAsyncThunk('auth/signup', async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', credentials);
      localStorage.setItem(tokenKey, res.data.token);
      return res.data.token;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Signup failed');
    }
  });
  

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
      .addCase(signup.fulfilled, (state, action) => {
        state.token = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
