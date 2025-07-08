import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Alert, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const backgroundUrl = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1500&q=80';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoginRole(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); // 'admin' or 'user'
      setLoading(false);
      setLoginRole(res.data.role);
      if (res.data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/user';
      }
    } catch (err) {
      setLoading(false);
      setError('Invalid credentials');
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
          <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="primary">Login</Typography>
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
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, py: 1.2, fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
          {loginRole && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Login successful as {loginRole}. If you are not redirected, click below:
              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                {loginRole === 'admin' ? (
                  <Button variant="contained" color="success" onClick={() => window.location.href = '/admin'}>Go to Admin Dashboard</Button>
                ) : (
                  <Button variant="contained" color="success" onClick={() => window.location.href = '/user'}>Go to User Dashboard</Button>
                )}
              </Box>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login; 