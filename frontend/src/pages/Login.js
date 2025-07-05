import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoginRole(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); // 'admin' or 'user'
      setLoading(false);
      setLoginRole(res.data.role);
      // Try redirect, but also show button as workaround
      if (res.data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/user';
      }
    } catch (err) {
      setLoading(false);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input id="login-email" name="email" className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input id="login-password" name="password" className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>
      {loginRole && (
        <div className="mt-4">
          <div className="alert alert-success">Login successful as {loginRole}. If you are not redirected, click below:</div>
          {loginRole === 'admin' ? (
            <button className="btn btn-success" onClick={() => window.location.href = '/admin'}>Go to Admin Dashboard</button>
          ) : (
            <button className="btn btn-success" onClick={() => window.location.href = '/user'}>Go to User Dashboard</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Login; 