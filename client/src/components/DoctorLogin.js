import React, { useState } from 'react';

// (Styles)
const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' };
const inputStyle = { margin: '0.5rem 0', padding: '0.5rem' };
const buttonStyle = { padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };

function DoctorLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/doctors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(data); // Pass user data up
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      alert('Could not connect to the server.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Doctor Portal Login</h2>
      <input type="email" placeholder="Doctor Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
      <button type="submit" style={buttonStyle}>Login</button>
    </form>
  );
}

export default DoctorLogin;