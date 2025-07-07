import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Typography, Box, Alert } from '@mui/material';

function ProblemForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [message, setMessage] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/problems', {
        title, description, testCases: [{ input, expectedOutput }], difficulty
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Problem added!');
      setTitle(''); setDescription(''); setInput(''); setExpectedOutput(''); setDifficulty('Easy');
    } catch (err) {
      setMessage('Error adding problem');
    }
  };

  return (
    <Box component="form" onSubmit={handleAdd} sx={{ mb: 4, p: 2, boxShadow: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom>Add Problem</Typography>
      <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} required sx={{ mb: 2 }} />
      <TextField fullWidth label="Description" value={description} onChange={e => setDescription(e.target.value)} required multiline rows={3} sx={{ mb: 2 }} />
      <TextField fullWidth label="Sample Input" value={input} onChange={e => setInput(e.target.value)} required multiline rows={3} sx={{ mb: 2 }} />
      <TextField fullWidth label="Expected Output" value={expectedOutput} onChange={e => setExpectedOutput(e.target.value)} required multiline rows={3} sx={{ mb: 2 }} />
      <TextField select label="Difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)} sx={{ mb: 2, minWidth: 120 }}>
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>
      <Button variant="contained" color="success" type="submit">Add Problem</Button>
      {message && <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
}

export default ProblemForm; 