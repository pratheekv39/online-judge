import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemList from './ProblemList';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <ProblemList />
    </div>
  );
}

export default UserDashboard; 