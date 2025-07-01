import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const res = await axios.get('http://localhost:5000/api/problems', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProblems(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/problems/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchProblems();
  };

  return (
    <div>
      <h4>Problems</h4>
      <ul className="list-group">
        {problems.map(p => (
          <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{p.title}</span>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProblemList; 