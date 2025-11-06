import React, { useState } from 'react';

// A simple style object to make the form look decent
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
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

function Register() {
  // 'useState' hooks to store what the user types
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // This function runs when the user clicks the "Register" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from refreshing

    try {
      // Send the form data to our server's register endpoint
      const response = await fetch('http://localhost:5001/api/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // response.ok checks for 2xx status codes
        console.log('Registration Successful:', data);
        alert('Registration successful! You can now log in.');
      } else {
        // Handle errors (like "Patient already exists")
        console.error('Registration Failed:', data.message);
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Server error:', error);
      alert('Could not connect to the server. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Patient Registration</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        required
      />

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

      <button type="submit" style={buttonStyle}>Register</button>
    </form>
  );
}

export default Register;