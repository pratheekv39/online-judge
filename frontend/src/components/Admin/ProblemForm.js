import React, { useState } from 'react';
import axios from 'axios';

function ProblemForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/problems', {
        title, description, testCases: [{ input, expectedOutput }]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Problem added!');
      setTitle(''); setDescription(''); setInput(''); setExpectedOutput('');
    } catch (err) {
      setMessage('Error adding problem');
    }
  };

  return (
    <form onSubmit={handleAdd} className="mb-4">
      <h4>Add Problem</h4>
      <input className="form-control mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <input className="form-control mb-2" placeholder="Sample Input" value={input} onChange={e => setInput(e.target.value)} required />
      <input className="form-control mb-2" placeholder="Expected Output" value={expectedOutput} onChange={e => setExpectedOutput(e.target.value)} required />
      <button className="btn btn-success" type="submit">Add Problem</button>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
}

export default ProblemForm; 