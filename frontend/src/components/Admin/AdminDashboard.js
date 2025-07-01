import React from 'react';
import ProblemForm from './ProblemForm';
import ProblemList from './ProblemList';

function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <ProblemForm />
      <ProblemList />
    </div>
  );
}

export default AdminDashboard; 