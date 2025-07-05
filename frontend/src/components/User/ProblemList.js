import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CodeSubmit from './CodeSubmit';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState([]);

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Fetch solved problems whenever the component mounts or when token changes
    const token = localStorage.getItem('token');
    if (token) {
      fetchSolved();
    } else {
      setSolved([]);
    }
  }, []); // This will run on mount and when token changes

  const fetchProblems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/problems');
      setProblems(res.data);
      console.log('Fetched problems:', res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load problems.');
      setLoading(false);
      console.error('ProblemList fetch error:', err);
    }
  };

  const fetchSolved = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSolved([]);
        return;
      }
      const res = await axios.get('http://localhost:5000/api/solved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolved(res.data.solved || []);
      console.log('Fetched solved problems:', res.data.solved);
    } catch (err) {
      console.error('Error fetching solved problems:', err);
      setSolved([]);
    }
  };

  if (loading) return <div>Loading problems...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!problems.length) return <div>No problems found. Please ask admin to add problems.</div>;

  return (
    <div>
      <h4>Problems</h4>
      <ul className="list-group">
        {problems.map(p => (
          <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {p.title}
              {solved.includes(p._id) && <span className="badge bg-success ms-2">Solved</span>}
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => setSelected(p)}>Solve</button>
          </li>
        ))}
      </ul>
      {selected && <CodeSubmit problem={selected} onSubmission={(verdict) => {
        if (verdict === 'Accepted') fetchSolved();
      }} />}
    </div>
  );
}

export default ProblemList; 