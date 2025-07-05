import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/User/UserDashboard';

function App() {
  const [authState, setAuthState] = useState({
    isLoggedIn: !!localStorage.getItem('token'),
    role: localStorage.getItem('role')
  });

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState({
        isLoggedIn: !!localStorage.getItem('token'),
        role: localStorage.getItem('role')
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={authState.isLoggedIn && authState.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/user"
          element={authState.isLoggedIn && authState.role === 'user' ? <UserDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App; 