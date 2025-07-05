const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  verdict: String,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Submission', SubmissionSchema); 