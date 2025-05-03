import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const token = () => localStorage.getItem('token');

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/todos`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to fetch todos');
  }
});

export const addTodo = createAsyncThunk('todos/addTodo', async (text, thunkAPI) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/todos`,
      { text },
      { headers: { Authorization: `Bearer ${token()}` } }
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to add todo');
  }
});

export const toggleTodo = createAsyncThunk('todos/toggleTodo', async ({ id, completed }, thunkAPI) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/todos/${id}`,
      { completed },
      { headers: { Authorization: `Bearer ${token()}` } }
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to toggle todo');
  }
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id, thunkAPI) => {
  try {
    await axios.delete(`http://localhost:5000/api/todos/${id}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to delete todo');
  }
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, text }, thunkAPI) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/todos/${id}`,
      { text },
      { headers: { Authorization: `Bearer ${token()}` } }
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to update todo text');
  }
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.todos[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t._id !== action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.todos[index] = action.payload;
      });
  },
});

export default todoSlice.reducer;
