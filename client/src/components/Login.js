import React, { useState } from 'react';

// (We can reuse the same styles, but for simplicity, I'll copy them here)
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '300px',
  margin: '2rem auto',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '5px'
};

const inputStyle = {
  margin: '0.5rem 0',
  padding: '0.5rem'
};

const buttonStyle = {
  padding: '0.5rem',
  backgroundColor: '#28a745', // Green for login
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

function Login({ onLoginSuccess }) {
  // 'useState' hooks for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // This function runs when the user clicks the "Login" button
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to our server's LOGIN endpoint
      const response = await fetch('http://localhost:5001/api/patients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login Successful:', data);
        //alert(`Welcome back, ${data.name}!`);
        onLoginSuccess(data);
        // **Important:** This is where we will save the user's token later
      } else {
        // Handle errors (like "Invalid email or password")
        console.error('Login Failed:', data.message);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Server error:', error);
      alert('Could not connect to the server. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Patient Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
        required
      />

      <button type="submit" style={buttonStyle}>Login</button>
    </form>
  );
}

export default Login;