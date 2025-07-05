import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemForm from './ProblemForm';
import ProblemList from './ProblemList';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <ProblemForm />
      <ProblemList />
    </div>
  );
}

export default AdminDashboard; 