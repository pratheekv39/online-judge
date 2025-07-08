import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, CircularProgress, Alert, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

const backgroundUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password, role });
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.includes('duplicate')) {
        setError('Email already exists. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(rgba(30,30,60,0.7), rgba(30,30,60,0.7)), url(${backgroundUrl}) center/cover no-repeat`,
    }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, p: 3, borderRadius: 4, boxShadow: 8, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.85)' }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="primary">Register</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              label="Role"
              value={role}
              onChange={e => setRole(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, py: 1.2, fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            {error && <Alert severity={error.includes('exists') ? 'warning' : 'error'} sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register; 