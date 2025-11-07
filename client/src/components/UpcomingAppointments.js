import React, { useState, useEffect } from 'react';

// (Styles)
const listStyle = { listStyle: 'none', padding: 0 };
const itemStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '1.5rem',
  marginBottom: '1rem',
  color: '#333',
  lineHeight: '1.6'
};
const joinButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  backgroundColor: '#28a745', // Green
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '1rem'
};
const disabledButtonStyle = {
  ...joinButtonStyle,
  backgroundColor: '#6c757d',
  cursor: 'not-allowed'
};

// --- This is the new component for each list item ---
const AppointmentItem = ({ appt, onJoinCall }) => {
  const [now, setNow] = useState(new Date());
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Compute appointment timing
  const appointmentStart = new Date(appt.appointmentDate);
  const appointmentEnd = new Date(appointmentStart.getTime() + 30 * 60000);
  const isJoinable = now >= true;
  const isPast = now >= appointmentEnd;

  const appointmentDateStr = appointmentStart.toLocaleDateString([], {
    weekday: 'long', month: 'short', day: 'numeric'
  });
  const appointmentTimeStr = appointmentStart.toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit'
  });

  // ✅ Hardcoded shared Daily room URL
  const SHARED_ROOM_URL = 'https://telehealt.daily.co/Ojw8EDdVsNlEu4fW5qBK'; 

  const handleJoinClick = () => {
    setJoining(true);
    // Pass appointment with roomUrl to App.js → VideoCall
    onJoinCall({ ...appt, roomUrl: SHARED_ROOM_URL });
    setJoining(false);
  };

  return (
    <li style={itemStyle}>
      <h4 style={{ marginTop: 0 }}>Dr. {appt.doctor.name}</h4>
      <p><strong>Specialty:</strong> {appt.doctor.specialty}</p>
      <p>
        <strong>Date:</strong> {appointmentDateStr}<br />
        <strong>Time:</strong> {appointmentTimeStr}
      </p>

      {isPast ? (
        <p style={{ color: '#6c757d', fontWeight: 'bold' }}>This appointment has ended.</p>
      ) : isJoinable ? (
        <button
          style={joinButtonStyle}
          onClick={handleJoinClick}
          disabled={joining}
        >
          {joining ? 'Joining...' : 'Join Call Now'}
        </button>
      ) : (
        <button style={disabledButtonStyle} disabled>
          Joinable at {appointmentTimeStr}
        </button>
      )}
    </li>
  );
};


// --- This is the main component ---
function UpcomingAppointments({ userInfo, onJoinCall }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/appointments/upcoming', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${userInfo.token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo.token) {
      fetchAppointments();
    }
    // Re-run this effect when userInfo or refreshKey changes
  }, [userInfo.token]); 

  // This logic is tricky, but we need a way for the Dashboard
  // to tell this component to refresh itself.
  // We'll update the Dashboard to pass a 'view' prop.
  // When the view changes to 'upcoming', we'll set the refreshKey.


  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <ul style={listStyle}>
          {appointments.map((appt) => (
            <AppointmentItem 
              key={appt._id} 
              appt={appt} 
              onJoinCall={onJoinCall}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default UpcomingAppointments;