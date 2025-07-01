import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CodeSubmit from './CodeSubmit';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const res = await axios.get('http://localhost:5000/api/problems');
    setProblems(res.data);
  };

  return (
    <div>
      <h4>Problems</h4>
      <ul className="list-group">
        {problems.map(p => (
          <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{p.title}</span>
            <button className="btn btn-primary btn-sm" onClick={() => setSelected(p)}>Solve</button>
          </li>
        ))}
      </ul>
      {selected && <CodeSubmit problem={selected} />}
    </div>
  );
}

export default ProblemList; 