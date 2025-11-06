import React, { useState, useCallback, useRef, useEffect } from 'react'; // Import useRef and useEffect
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard';
import VideoCall from './components/VideoCall';

// (PatientRoute and DoctorRoute are unchanged)
function PatientRoute({ children }) {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? children : <Navigate to="/" />;
}
function DoctorRoute({ children }) {
  const doctorInfo = localStorage.getItem('doctorInfo');
  return doctorInfo ? children : <Navigate to="/" />;
}

function App() {
  const navigate = useNavigate();
  const [activeCall, setActiveCall] = useState(null);

  // --- THIS IS THE FIX ---
  // We use a ref to track the activeCall's value.
  // This allows handleLeaveCall to be stable (created only once)
  // but still access the most current activeCall.
  const activeCallRef = useRef(activeCall);
  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  // This function handles logout for ALL users
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('doctorInfo');
    setActiveCall(null);
    navigate('/'); 
  };

  // Universal "Join Call" Handler
  const handleJoinCall = useCallback((appointment) => {
    setActiveCall(appointment);
  }, []); // This is stable

  // --- NEW, STABLE "Leave Call" Handler ---
  // This function is now created only ONCE and will never
  // cause the VideoCall component to re-render.
  const handleLeaveCall = useCallback(() => {
    const userInfo = localStorage.getItem('userInfo');
    // Get the current call from the ref, not from state
    const callToComplete = activeCallRef.current; 

    if (userInfo && callToComplete) {
      try {
        fetch(`http://localhost:5001/api/appointments/complete/${callToComplete._id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${JSON.parse(userInfo).token}` },
        });
      } catch (err) {
        console.error("Failed to mark appointment as complete", err);
      }
    }
    
    setActiveCall(null);
    if (userInfo) navigate('/dashboard');
    else navigate('/doctor/dashboard');
  }, [navigate]); // It only depends on navigate, which is stable.


  // --- If a call is active, show the video call ONLY ---
  if (activeCall) {
    return (
      <div className="App">
        <header className="App-header" style={{height: '100vh', justifyContent: 'center'}}>
          <VideoCall 
            roomUrl={activeCall.roomUrl}
            onLeaveCall={handleLeaveCall} // Pass the stable function
          />
        </header>
      </div>
    );
  }

  // --- Otherwise, show the normal routes ---
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Veersa Telehealth Solution
        </h1>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/dashboard" 
            element={
              <PatientRoute>
                <Dashboard 
                  userInfo={JSON.parse(localStorage.getItem('userInfo'))} 
                  onLogout={handleLogout} 
                  onJoinCall={handleJoinCall}
                />
              </PatientRoute>
            } 
          />
          <Route 
            path="/doctor/dashboard" 
            element={
              <DoctorRoute>
                <DoctorDashboard 
                  doctorInfo={JSON.parse(localStorage.getItem('doctorInfo'))}
                  onLogout={handleLogout}
                  onJoinCall={handleJoinCall}
                />
              </DoctorRoute>
            } 
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;