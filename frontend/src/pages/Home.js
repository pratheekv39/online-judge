import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <h2>Welcome to the Online Judge</h2>
      <Link className="btn btn-primary m-2" to="/login">Login</Link>
      <Link className="btn btn-secondary m-2" to="/register">Register</Link>
    </div>
  );
}

export default Home; 