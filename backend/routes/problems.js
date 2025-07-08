const express = require('express');
const { Problem } = require('../models/Problem');
const router = express.Router();
const Submission = require('../models/Submission');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/User');

// Get all problems
router.get('/', async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

// Add a new problem (admin only, but for now no auth middleware)
router.post('/', async (req, res) => {
  const { title, description, testCases, difficulty } = req.body;
  const problem = await Problem.create({ title, description, testCases, difficulty });
  res.json(problem);
});

// Delete a problem (admin only, but for now no auth middleware)
router.delete('/:id', async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Update a problem (admin only, but for now no auth middleware)
router.put('/:id', async (req, res) => {
  const { title, description, testCases, difficulty } = req.body;
  const updated = await Problem.findByIdAndUpdate(
    req.params.id,
    { title, description, testCases, difficulty },
    { new: true }
  );
  res.json(updated);
});

function getUserEmailFromReq(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.email;
  } catch {
    return null;
  }
}

// Get solved problems by difficulty for the logged-in user
router.get('/stats/solved-by-difficulty', async (req, res) => {
  const userEmail = getUserEmailFromReq(req);
  if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(401).json({ error: 'User not found' });
  const userId = user._id;
  const submissions = await Submission.find({ userId, verdict: 'Accepted' }).populate('problemId');
  const solved = {};
  submissions.forEach(sub => {
    const diff = sub.problemId.difficulty || 'Unknown';
    solved[diff] = (solved[diff] || 0) + 1;
  });
  res.json(solved);
});

// Get submission counts per day for the last 30 days for the logged-in user
router.get('/stats/submissions-over-time', async (req, res) => {
  const userEmail = getUserEmailFromReq(req);
  if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(401).json({ error: 'User not found' });
  const userId = user._id;
  const since = new Date();
  since.setDate(since.getDate() - 29);
  const submissions = await Submission.find({ userId, timestamp: { $gte: since } });
  const counts = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    counts[key] = 0;
  }
  submissions.forEach(sub => {
    const key = sub.timestamp.toISOString().slice(0, 10);
    if (counts[key] !== undefined) counts[key]++;
  });
  res.json(counts);
});

module.exports = router; 