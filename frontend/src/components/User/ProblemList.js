import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CodeSubmit from './CodeSubmit';
import { List, ListItem, ListItemText, IconButton, Chip, Typography, Box, CircularProgress, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const HUGGINGFACE_API_KEY = process.env.REACT_APP_HF_API_KEY;

function ProblemList({ refreshStats }) {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintText, setHintText] = useState('');
  const [hintLoading, setHintLoading] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchSolved();
    } else {
      setSolved([]);
    }
  }, []);

  const fetchProblems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/problems');
      setProblems(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load problems.');
      setLoading(false);
    }
  };

  const fetchSolved = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSolved([]);
        return;
      }
      const res = await axios.get('http://localhost:5000/api/solved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolved(res.data.solved || []);
    } catch (err) {
      setSolved([]);
    }
  };

  const getChipColor = (difficulty) => {
    if (difficulty === 'Easy') return 'success';
    if (difficulty === 'Medium') return 'warning';
    if (difficulty === 'Hard') return 'error';
    return 'default';
  };

  const handleHint = async (problem) => {
    setHintOpen(true);
    setHintText('');
    setHintLoading(true);
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        { inputs: `Give a hint for this problem: ${problem.description}` },
        { headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` } }
      );
      setHintText(response.data && response.data.length ? response.data[0].summary_text || JSON.stringify(response.data) : 'No hint available.');
    } catch (err) {
      setHintText('Failed to fetch hint.');
    }
    setHintLoading(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!problems.length) return <Typography>No problems found. Please ask admin to add problems.</Typography>;

  return (
    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 3, bgcolor: 'background.paper', mt: 3 }}>
      <Typography variant="h5" gutterBottom>Problems</Typography>
      <List sx={{ width: '100%' }}>
        {problems.map(p => (
          <ListItem
            key={p._id}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: 1,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: 4, bgcolor: 'grey.50' }
            }}
            secondaryAction={
              <Box>
                <Tooltip title="Get a hint">
                  <IconButton color="warning" onClick={() => handleHint(p)} sx={{ mr: 1 }}>
                    <LightbulbIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Solve">
                  <IconButton color="primary" onClick={() => setSelected(p)}>
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemText
              primary={<Box sx={{ fontWeight: 500 }}>{p.title}</Box>}
              secondary={<>
                <Chip label={p.difficulty} color={getChipColor(p.difficulty)} size="small" sx={{ mr: 1 }} />
                {solved.includes(p._id) && <Chip icon={<CheckCircleIcon />} label="Solved" color="success" size="small" />}
              </>}
            />
          </ListItem>
        ))}
      </List>
      {selected && <CodeSubmit problem={selected} refreshStats={refreshStats} onSubmission={(verdict) => {
        if (verdict === 'Accepted') fetchSolved();
      }} />}
      <Dialog open={hintOpen} onClose={() => setHintOpen(false)}>
        <DialogTitle>Problem Hint</DialogTitle>
        <DialogContent>
          {hintLoading ? <CircularProgress /> : <Typography>{hintText}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHintOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ProblemList; 