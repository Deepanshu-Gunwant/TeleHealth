import React, { useState, useEffect } from 'react';

// (We can re-use the same styles)
const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const itemStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '1rem',
  marginBottom: '1rem',
  color: '#333'
};

function PastAppointments({ userInfo }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/appointments/past', { // <-- THE ONLY CHANGE
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

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
  }, [userInfo.token]);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      {appointments.length === 0 ? (
        <p>You have no past appointments.</p>
      ) : (
        <ul style={listStyle}>
          {appointments.map((appt) => (
            <li key={appt._id} style={itemStyle}>
              <h4>Specialty: {appt.specialty}</h4>
              <p>Status: {appt.status}</p>
              <p>Completed on: {new Date(appt.updatedAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PastAppointments;