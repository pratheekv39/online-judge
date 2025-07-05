import React, { useState } from 'react';
import axios from 'axios';

function CodeSubmit({ problem, onSubmission }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [verdict, setVerdict] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerdict('Running...');
    setDetails('');
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/submit', {
      code, language, problemId: problem._id
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    setVerdict(res.data.verdict);
    setDetails(res.data.details || '');
    if (onSubmission) onSubmission(res.data.verdict);
  };

  return (
    <div className="mt-4">
      <h5>{problem.title}</h5>
      <p>{problem.description}</p>
      <form onSubmit={handleSubmit}>
        <select className="form-control mb-2" value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="cpp">C++</option>
        </select>
        <textarea
          className="form-control mb-2"
          rows={10}
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Write your code here"
        />
        <button className="btn btn-success" type="submit">Submit</button>
      </form>
      <div className="mt-2">
        <b>Verdict:</b> {verdict}
        {details && <pre>{details}</pre>}
      </div>
    </div>
  );
}

export default CodeSubmit; 