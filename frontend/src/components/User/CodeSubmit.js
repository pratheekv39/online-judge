import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, MenuItem, Alert, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

function CodeSubmit({ problem, onSubmission }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [verdict, setVerdict] = useState('');
  const [details, setDetails] = useState([]);

  // Only show first two test cases as samples
  const sampleTestCases = (problem.testCases || []).slice(0, 2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerdict('Running...');
    setDetails([]);
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/submit', {
      code, language, problemId: problem._id
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    setVerdict(res.data.verdict);
    setDetails(res.data.details || []);
    if (onSubmission) onSubmission(res.data.verdict);
  };

  return (
    <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{problem.title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{problem.description}</Typography>
      {sampleTestCases.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Sample Test Cases</Typography>
          <List>
            {sampleTestCases.map((tc, idx) => (
              <ListItem key={idx} alignItems="flex-start" sx={{ pl: 0 }}>
                <ListItemText
                  primary={`Input ${idx + 1}:`}
                  secondary={<Box component="span" sx={{ fontFamily: 'monospace', fontSize: 14 }}>{tc.input}</Box>}
                />
                <ListItemText
                  primary={`Expected Output ${idx + 1}:`}
                  secondary={<Box component="span" sx={{ fontFamily: 'monospace', fontSize: 14 }}>{tc.expectedOutput}</Box>}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          select
          label="Language"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="cpp">C++</MenuItem>
        </TextField>
        <TextField
          label="Your Code"
          multiline
          minRows={10}
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Write your code here"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="success" type="submit" fullWidth sx={{ py: 1.2, fontWeight: 600 }}>
          Submit
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography fontWeight={600}>Verdict:</Typography>
        {verdict && <Alert severity={verdict === 'Accepted' ? 'success' : verdict === 'Running...' ? 'info' : 'error'} sx={{ mt: 1 }}>{verdict}</Alert>}
        {verdict !== 'Accepted' && details && details.length > 0 && (
          <List sx={{ mt: 2 }}>
            {details.map((fail, idx) => (
              fail.hidden ? (
                <ListItem key={idx} alignItems="flex-start">
                  <ListItemText primary={`Test Case #${fail.index}: Hidden`} secondary={null} />
                </ListItem>
              ) : (
                <ListItem key={idx} alignItems="flex-start">
                  <ListItemText
                    primary={`Test Case #${fail.index}${fail.runtimeError ? ' (Runtime Error)' : ''}`}
                    secondary={
                      <>
                        <Box component="span" sx={{ display: 'block', fontFamily: 'monospace', fontSize: 14 }}>
                          <b>Input:</b> {fail.input}
                        </Box>
                        <Box component="span" sx={{ display: 'block', fontFamily: 'monospace', fontSize: 14 }}>
                          <b>Expected:</b> {fail.expected}
                        </Box>
                        <Box component="span" sx={{ display: 'block', fontFamily: 'monospace', fontSize: 14 }}>
                          <b>Got:</b> {fail.got}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              )
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}

export default CodeSubmit; 