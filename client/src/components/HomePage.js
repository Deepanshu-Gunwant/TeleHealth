import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import DoctorLogin from './DoctorLogin'; // Import doctor login

// (Styles)
const authContainerStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' };

function HomePage() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      navigate('/dashboard'); // If logged in, go to dashboard
    }

    const storedDoctor = localStorage.getItem('doctorInfo');
    if (storedDoctor) {
      // We'll build this page next
      navigate('/doctor/dashboard');
    }
  }, [navigate]);

  // --- Patient Login Handler ---
  const handleLogin = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
    navigate('/dashboard');
  };

  // --- Doctor Login Handler ---
  const handleDoctorLogin = (doctorData) => {
    localStorage.setItem('doctorInfo', JSON.stringify(doctorData));
    // We'll build this page next
    navigate('/doctor/dashboard');
  };

  return (
    <div style={authContainerStyle}>
      <Register />
      <Login onLoginSuccess={handleLogin} />
      <DoctorLogin onLoginSuccess={handleDoctorLogin} />
    </div>
  );
}

export default HomePage;