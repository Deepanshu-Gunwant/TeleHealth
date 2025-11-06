import React from 'react';

// (Styles)
const containerStyle = {
  padding: '2rem',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  color: '#333',
  border: '1px solid #28a745',
  textAlign: 'center'
};
const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1rem',
  marginTop: '2rem'
};

function BookingConfirmation({ appointment, onDone }) {
  if (!appointment) {
    return <p>Loading confirmation...</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#28a745' }}>Appointment Confirmed!</h2>
      <p>A confirmation has been sent to your email.</p>
      <hr style={{ margin: '1rem 0' }} />

      <h3>Appointment Details:</h3>
      <p><strong>Specialty:</strong> {appointment.specialty}</p>
      <p><strong>Reason:</strong> {appointment.symptoms}</p>
      <p><strong>Booked On:</strong> {new Date(appointment.createdAt).toLocaleString()}</p>
      <p><strong>Appointment ID:</strong> {appointment._id}</p>

      <p style={{ marginTop: '2rem' }}>
        You can view this appointment in your **"Upcoming"** tab, where you can join the call at the scheduled time.
      </p>

      <button style={buttonStyle} onClick={onDone}>
        Go to My Appointments
      </button>
    </div>
  );
}

export default BookingConfirmation;