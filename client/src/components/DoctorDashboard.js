import React, { useState, useEffect } from 'react';

// (Styles)
const dashboardStyle = { padding: '2rem', maxWidth: '900px', margin: '0 auto' };
const listStyle = { listStyle: 'none', padding: 0 };
const itemStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '1rem',
  color: '#333'
};
const intakeStyle = {
  backgroundColor: '#fff',
  border: '1px solid #eee',
  padding: '1rem',
  borderRadius: '5px',
  marginTop: '1rem'
};
const joinButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '1rem'
};

// This is the main component
function DoctorDashboard({ doctorInfo, onLogout, onJoinCall }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/appointments/doctor', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${doctorInfo.token}`,
          },
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

    if (doctorInfo.token) {
      fetchAppointments();
    }
  }, [doctorInfo.token]);

  return (
    <div style={dashboardStyle}>
      <h2>Dr. {doctorInfo.name}'s Dashboard</h2>
      <p>Your Specialty: {doctorInfo.specialty}</p>
      <hr style={{ margin: '2rem 0' }} />

      <h3>Your Upcoming Appointments</h3>
      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {appointments.length === 0 && !loading ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <ul style={listStyle}>
          {appointments.map((appt) => {
            const apptDate = new Date(appt.appointmentDate);
            return (
              <li key={appt._id} style={itemStyle}>
                <h4>{apptDate.toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'})} at {apptDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</h4>

                <p><strong>Patient:</strong> {appt.patient.name} ({appt.patient.email})</p>

                {/* --- Intake Form Data --- */}
                <div style={intakeStyle}>
                  <strong>Patient Intake Form:</strong>
                  <ul style={{paddingLeft: '20px', lineHeight: '1.6'}}>
                    <li><strong>Age:</strong> {appt.age}</li>
                    <li><strong>Gender:</strong> {appt.gender}</li>
                    <li><strong>Symptoms:</strong> {appt.symptoms}</li>
                    <li><strong>Medications/Allergies:</strong> {appt.medicationsAndAllergies}</li>
                  </ul>
                </div>

                {/* --- Doctor Join Button --- */}
                <button 
                  style={joinButtonStyle}
                  onClick={() => onJoinCall(appt)}
                >
                  Join Call
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <button 
        onClick={onLogout} 
        style={{...joinButtonStyle, backgroundColor: 'red', marginTop: 0}}
      >
        Logout
      </button>
    </div>
  );
}

export default DoctorDashboard;