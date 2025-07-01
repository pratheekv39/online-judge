const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const TestCase = require('./models/TestCase');
const Problem = require('./models/Problem');
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

mongoose.connect('mongodb://localhost:27017/oj', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/api/submit', async (req, res) => {
  const { code, language, problemId } = req.body;
  if (!code || !language || !problemId) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (language !== 'cpp') {
    return res.status(400).json({ error: 'Only C++ supported for now' });
  }

  // Fetch test cases from problems collection
  const problem = await Problem.findById(problemId);
  if (!problem || !problem.testCases || !problem.testCases.length) {
    return res.status(404).json({ error: 'No test cases found' });
  }
  const testCases = problem.testCases;

  // Save code to temp file
  const tempId = uuidv4();
  const codePath = path.join(__dirname, `${tempId}.cpp`);
  const exePath = path.join(__dirname, `${tempId}.exe`);
  fs.writeFileSync(codePath, code);

  // Compile
  exec(`g++ "${codePath}" -o "${exePath}"`, (compileErr, stdout, stderr) => {
    if (compileErr) {
      fs.unlinkSync(codePath);
      return res.json({ verdict: 'Compilation Error', details: stderr });
    }

    // Run against all test cases
    let verdict = 'Accepted';
    let details = '';
    (async function runTests() {
      for (const tc of testCases) {
        try {
          const result = await new Promise((resolve, reject) => {
            const child = exec(`"${exePath}"`, { timeout: 3000 }, (err, stdout, stderr) => {
              if (err) return reject(stderr || err.message);
              resolve(stdout.trim());
            });
            child.stdin.write(tc.input);
            child.stdin.end();
          });
          if (result !== tc.expectedOutput.trim()) {
            verdict = 'Wrong Answer';
            details = `Input: ${tc.input}\nExpected: ${tc.expectedOutput}\nGot: ${result}`;
            break;
          }
        } catch (err) {
          verdict = 'Runtime Error';
          details = err;
          break;
        }
      }
      // Cleanup
      fs.unlinkSync(codePath);
      if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      res.json({ verdict, details });
    })();
  });
});

app.listen(5000, () => console.log('Backend running on port 5000')); 