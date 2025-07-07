import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemList from './ProblemList';
import { Box, Button, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#4caf50', '#ff9800', '#f44336'];

function UserDashboard() {
  const navigate = useNavigate();
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [solvedRes, subRes] = await Promise.all([
          axios.get('http://localhost:5000/api/problems/stats/solved-by-difficulty', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/problems/stats/submissions-over-time', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        // Pie chart data
        const pie = ['Easy', 'Medium', 'Hard'].map(name => ({ name, value: solvedRes.data[name] || 0 }));
        setPieData(pie);
        // Bar chart data
        const bar = Object.entries(subRes.data).map(([date, submissions]) => ({ date, submissions }));
        setBarData(bar);
      } catch (err) {
        setPieData([]);
        setBarData([]);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ mt: 5, mx: 'auto', maxWidth: 900 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">User Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>Solved Problems by Difficulty</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>Submissions Over Time (Last 30 Days)</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="submissions" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
      <ProblemList />
    </Box>
  );
}

export default UserDashboard; 