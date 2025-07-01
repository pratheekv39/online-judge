const mongoose = require('mongoose');
const TestCaseSchema = new mongoose.Schema({
  problemId: String,
  input: String,
  expectedOutput: String,
});
module.exports = mongoose.model('TestCase', TestCaseSchema); 