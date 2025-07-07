const mongoose = require('mongoose');
const ProblemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ]
});

module.exports = {
  Problem: mongoose.model('Problem', ProblemSchema),
  ProblemSchema
}; 