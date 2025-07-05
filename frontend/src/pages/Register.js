import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password, role });
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.includes('duplicate')) {
        setError('Email already exists. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input id="register-email" name="email" className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input id="register-password" name="password" className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <select id="register-role" name="role" className="form-control mb-2" value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn btn-primary" type="submit">Register</button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>
    </div>
  );
}

export default Register; 