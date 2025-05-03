import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const token = () => localStorage.getItem('token');

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

// Fetch all todos
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to fetch todos');
  }
});

// Add a new todo
export const addTodo = createAsyncThunk('todos/addTodo', async (text, thunkAPI) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/todos`,
      { text },
      {
        headers: { Authorization: `Bearer ${token()}` },
      }
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to add todo');
  }
});

// Toggle a todo's completed state
export const toggleTodo = createAsyncThunk('todos/toggleTodo', async ({ id, completed }, thunkAPI) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/todos/${id}`,
      { completed },
      {
        headers: { Authorization: `Bearer ${token()}` },
      }
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to toggle todo');
  }
});

// Delete a todo
export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id, thunkAPI) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to delete todo');
  }
});

// Update a todo's text
export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, text }, thunkAPI) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/todos/${id}`,
      { text },
      {
        headers: { Authorization: `Bearer ${token()}` },
      }
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Failed to update todo');
  }
});

// Slice
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
