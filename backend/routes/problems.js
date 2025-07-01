const express = require('express');
const Problem = require('../models/Problem');
const router = express.Router();

// Get all problems
router.get('/', async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

// Add a new problem (admin only, but for now no auth middleware)
router.post('/', async (req, res) => {
  const { title, description, testCases } = req.body;
  const problem = await Problem.create({ title, description, testCases });
  res.json(problem);
});

// Delete a problem (admin only, but for now no auth middleware)
router.delete('/:id', async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router; 