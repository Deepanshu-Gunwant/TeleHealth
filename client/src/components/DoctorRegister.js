import React, { useState } from 'react';

// (Styles)
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '400px',
  margin: '2rem auto',
  padding: '2rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  color: '#333'
};
const inputStyle = { margin: '0.5rem 0 1rem 0', padding: '0.5rem', fontSize: '1rem' };
const buttonStyle = { padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem' };

function DoctorRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('General Practice');
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '17:00' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/doctors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, specialty, workingHours }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Doctor registered: ${data.name}`);
        setName(''); setEmail(''); setPassword(''); // Clear form
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert(`Server error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Register a New Doctor (Test Tool)</h2>
      <input type="text" placeholder="Doctor Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
      <input type="email" placeholder="Doctor Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
      <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={inputStyle}>
        <option value="Cardiology">Cardiology</option>
        <option value="Dermatology">Dermatology</option>
        <option value="Pediatrics">Pediatrics</option>
        <option value="Neurology">Neurology</option>
        <option value="General Practice">General Practice</option>
      </select>
      <label>Working Hours Start:</label>
      <input type="time" value={workingHours.start} onChange={(e) => setWorkingHours(prev => ({...prev, start: e.target.value}))} style={inputStyle} />
      <label>Working Hours End:</label>
      <input type="time" value={workingHours.end} onChange={(e) => setWorkingHours(prev => ({...prev, end: e.target.value}))} style={inputStyle} />
      <button type="submit" style={buttonStyle}>Register Doctor</button>
    </form>
  );
}
export default DoctorRegister;