import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemForm from './ProblemForm';
import ProblemList from './ProblemList';
import { Box, Typography, Button, Paper } from '@mui/material';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <Box sx={{ mt: 5, mx: 'auto', maxWidth: 900 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <ProblemForm />
      <ProblemList />
    </Box>
  );
}

export default AdminDashboard; 