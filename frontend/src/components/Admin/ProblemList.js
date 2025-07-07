import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const res = await axios.get('http://localhost:5000/api/problems', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProblems(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/problems/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchProblems();
  };

  const getChipColor = (difficulty) => {
    if (difficulty === 'Easy') return 'success';
    if (difficulty === 'Medium') return 'warning';
    if (difficulty === 'Hard') return 'error';
    return 'default';
  };

  return (
    <Box sx={{ p: 2, boxShadow: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom>Problems</Typography>
      <List>
        {problems.map(p => (
          <ListItem key={p._id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(p._id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText
              primary={p.title}
              secondary={<Chip label={p.difficulty} color={getChipColor(p.difficulty)} size="small" />}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ProblemList; 