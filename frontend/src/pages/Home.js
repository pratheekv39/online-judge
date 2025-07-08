import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Stack, Card, CardContent } from '@mui/material';

const backgroundUrl = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80';

function Home() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(rgba(30,30,60,0.7), rgba(30,30,60,0.7)), url(${backgroundUrl}) center/cover no-repeat`,
    }}>
      <Card sx={{ minWidth: 350, maxWidth: 500, p: 4, borderRadius: 4, boxShadow: 8, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.85)' }}>
        <CardContent>
          <Typography variant="h3" align="center" fontWeight={700} color="primary" gutterBottom>
            Welcome to the Online Judge
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
            Practice coding, solve problems, and improve your skills!
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button component={Link} to="/login" variant="contained" color="primary" size="large">
              Login
            </Button>
            <Button component={Link} to="/register" variant="outlined" color="primary" size="large">
              Register
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Home; 