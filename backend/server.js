const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const TestCase = require('./models/TestCase');
const { Problem } = require('./models/Problem');
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const Submission = require('./models/Submission');
const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Uncomment if not already used

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oj', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Helper to get userId from JWT
function getUserIdFromReq(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

app.post('/api/submit', async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    console.log('problemId received:', problemId); // Log for debugging
    const userId = getUserIdFromReq(req);
    if (!code || !language || !problemId) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (language !== 'cpp') {
      return res.status(400).json({ error: 'Only C++ supported for now' });
    }

    // Fetch test cases from problems collection
    let problem;
    try {
      problem = await Problem.findById(problemId);
    } catch (err) {
      console.error('Error fetching problem:', err);
      return res.status(500).json({ error: 'Failed to fetch problem' });
    }
    if (!problem || !problem.testCases || !problem.testCases.length) {
      return res.status(404).json({ error: 'No test cases found' });
    }
    const testCases = problem.testCases;

    // Save code to temp file
    const tempId = uuidv4();
    const codePath = path.join(__dirname, `${tempId}.cpp`);
    const exePath = path.join(__dirname, `${tempId}.exe`);
    try {
      fs.writeFileSync(codePath, code);
    } catch (err) {
      console.error('Error writing code file:', err);
      return res.status(500).json({ error: 'Failed to write code file' });
    }

    // Compile
    exec(`g++ "${codePath}" -o "${exePath}"`, (compileErr, stdout, stderr) => {
      if (compileErr) {
        try { fs.unlinkSync(codePath); } catch {}
        if (userId) Submission.create({ userId, problemId, verdict: 'Compilation Error' });
        return res.json({ verdict: 'Compilation Error', details: stderr });
      }

      function normalizeOutput(str) {
        return str
          .trim()
          .replace(/\r\n/g, '\n')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n');
      }

      // Run against all test cases
      (async function runTests() {
        let passed = 0;
        let details = [];
        try {
          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            try {
              const result = await new Promise((resolve, reject) => {
                const child = exec(`"${exePath}"`, { timeout: 3000 }, (err, stdout, stderr) => {
                  if (err) return reject(stderr || err.message);
                  resolve(stdout.trim());
                });
                child.stdin.write(tc.input);
                child.stdin.end();
              });
              if (normalizeOutput(result) === normalizeOutput(tc.expectedOutput)) {
                passed++;
                if (i < 2) {
                  details.push({
                    index: i + 1,
                    input: tc.input,
                    expected: tc.expectedOutput,
                    got: result
                  });
                } else {
                  details.push({
                    index: i + 1,
                    hidden: true
                  });
                }
              } else {
                if (i < 2) {
                  details.push({
                    index: i + 1,
                    input: tc.input,
                    expected: tc.expectedOutput,
                    got: result
                  });
                } else {
                  details.push({
                    index: i + 1,
                    hidden: true
                  });
                }
              }
            } catch (err) {
              if (i < 2) {
                details.push({
                  index: i + 1,
                  input: tc.input,
                  expected: tc.expectedOutput,
                  got: err.toString(),
                  runtimeError: true
                });
              } else {
                details.push({
                  index: i + 1,
                  hidden: true
                });
              }
            }
          }
        } catch (err) {
          details.push({ error: err.toString() });
          console.error('Error during test execution:', err);
        } finally {
          // Cleanup
          try { fs.unlinkSync(codePath); } catch {}
          try { if (fs.existsSync(exePath)) fs.unlinkSync(exePath); } catch {}
          let verdict = '';
          if (passed === testCases.length) {
            verdict = 'Accepted';
          } else {
            verdict = `${passed}/${testCases.length} test cases passed`;
          }
          if (userId) await Submission.create({ userId, problemId, verdict });
          try {
            res.json({ verdict, details });
          } catch (err) {
            console.error('Error sending response:', err);
          }
        }
      })();
    });
  } catch (err) {
    console.error('Unexpected error in /api/submit:', err);
    try { res.status(500).json({ error: 'Internal server error' }); } catch {}
  }
});

// Get solved problems for the logged-in user
app.get('/api/solved', async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const solved = await Submission.find({ userId, verdict: 'Accepted' }).distinct('problemId');
  res.json({ solved });
});

app.listen(5000, () => console.log('Backend running on port 5000')); 