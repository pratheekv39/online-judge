import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Typography, Box, Alert, IconButton, Stack, Collapse } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function ProblemForm({ editData, onClose }) {
  const [title, setTitle] = useState(editData ? editData.title : '');
  const [description, setDescription] = useState(editData ? editData.description : '');
  const [difficulty, setDifficulty] = useState(editData ? editData.difficulty : 'Easy');
  const [message, setMessage] = useState('');
  const [testCases, setTestCases] = useState(editData ? editData.testCases : [{ input: '', expectedOutput: '' }]);
  const [showAll, setShowAll] = useState(false);
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setDescription(editData.description);
      setDifficulty(editData.difficulty);
      setTestCases(editData.testCases && editData.testCases.length ? editData.testCases : [{ input: '', expectedOutput: '' }]);
    }
  }, [editData]);

  const handleTestCaseChange = (idx, field, value) => {
    setTestCases(prev => prev.map((tc, i) => i === idx ? { ...tc, [field]: value } : tc));
  };

  const handleAddTestCase = () => {
    setTestCases(prev => [...prev, { input: '', expectedOutput: '' }]);
  };

  const handleRemoveTestCase = (idx) => {
    setTestCases(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/problems/${editData._id}`,
          { title, description, testCases, difficulty },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setMessage('Problem updated!');
        if (onClose) setTimeout(() => onClose(true), 800);
      } else {
        await axios.post('http://localhost:5000/api/problems', {
          title, description, testCases, difficulty
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessage('Problem added!');
        setTitle(''); setDescription(''); setDifficulty('Easy');
        setTestCases([{ input: '', expectedOutput: '' }]);
      }
    } catch (err) {
      setMessage('Error saving problem');
    }
  };

  const hiddenCount = testCases.length - 2;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 2, boxShadow: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom>{isEdit ? 'Edit Problem' : 'Add Problem'}</Typography>
      <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} required sx={{ mb: 2 }} />
      <TextField fullWidth label="Description" value={description} onChange={e => setDescription(e.target.value)} required multiline rows={3} sx={{ mb: 2 }} />
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Test Cases</Typography>
      {testCases.map((tc, idx) => (
        <Collapse in={idx < 2 || showAll} key={idx}>
          <Box sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, position: 'relative' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
              <TextField
                label={`Input ${idx + 1}`}
                value={tc.input}
                onChange={e => handleTestCaseChange(idx, 'input', e.target.value)}
                required
                multiline
                rows={2}
                sx={{ flex: 1 }}
              />
              <TextField
                label={`Expected Output ${idx + 1}`}
                value={tc.expectedOutput}
                onChange={e => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                required
                multiline
                rows={2}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => handleRemoveTestCase(idx)} disabled={testCases.length === 1} sx={{ mt: { xs: 1, sm: 0 } }}>
                <RemoveCircleIcon />
              </IconButton>
            </Stack>
          </Box>
        </Collapse>
      ))}
      {hiddenCount > 0 && !showAll && (
        <Button onClick={() => setShowAll(true)} sx={{ mb: 2 }}>
          Show {hiddenCount} more test case{hiddenCount > 1 ? 's' : ''}
        </Button>
      )}
      <Button startIcon={<AddCircleIcon />} onClick={handleAddTestCase} sx={{ mb: 2 }}>
        Add Test Case
      </Button>
      <TextField select label="Difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)} sx={{ mb: 2, minWidth: 120 }}>
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>
      <Button variant="contained" color="success" type="submit" sx={{ ml: 2, minWidth: 140 }}>{isEdit ? 'Update Problem' : 'Add Problem'}</Button>
      {message && <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 2 }}>{message}</Alert>}
      {onClose && isEdit && (
        <Button onClick={() => onClose(false)} sx={{ mt: 2 }}>Cancel</Button>
      )}
    </Box>
  );
}

export default ProblemForm; 