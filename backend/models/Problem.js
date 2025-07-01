const mongoose = require('mongoose');
const ProblemSchema = new mongoose.Schema({
  title: String,
  description: String,
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ]
});
module.exports = mongoose.model('Problem', ProblemSchema); 