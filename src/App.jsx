import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TodoPage from './pages/TodoPage';
// user 1
function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/todos"
        element={isAuthenticated ? <TodoPage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/todos" />} />
    </Routes>
  );
}

export default App;