import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/User/UserDashboard';

function App() {
  // You can use context or localStorage for auth/role, here is a simple example:
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 'admin' or 'user'

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={isLoggedIn && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/user"
          element={isLoggedIn && role === 'user' ? <UserDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App; 