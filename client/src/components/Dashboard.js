import React, { useState, useCallback } from 'react';

// Import all the components
import AppointmentWizard from './AppointmentWizard';
import PaymentForm from './PaymentForm';
// VideoCall is no longer needed here, App.js handles it
import UpcomingAppointments from './UpcomingAppointments';
import PastAppointments from './PastAppointments';
import BookingConfirmation from './BookingConfirmation';

// (Styles)
const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '2rem'
};
const tabButtonStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
};
const activeTabButtonStyle = {
  ...tabButtonStyle,
  backgroundColor: '#007bff',
  color: 'white'
};

// --- FINAL, SIMPLIFIED DASHBOARD ---
// It receives onLogout and onJoinCall from App.js
function Dashboard({ userInfo, onLogout, onJoinCall }) {
  
  const [view, setView] = useState('new'); // 'new', 'upcoming', 'past'
  const [appStep, setAppStep] = useState('select'); // 'select', 'pay', 'confirm'
  
  // This holds the full data from the AppointmentWizard
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // This holds the appointment after it's created
  const [currentAppointment, setCurrentAppointment] = useState(null);
  
  // For loading/error messages
  const [bookingMessage, setBookingMessage] = useState('');


  // --- TAB NAVIGATION ---
  const showNew = () => {
    setView('new');
    setAppStep('select'); 
    setBookingMessage('');
  };
  const showUpcoming = () => setView('upcoming');
  const showPast = () => setView('past');


  // --- "BOOK NEW" FLOW FUNCTIONS ---

  // 1. Called by AppointmentWizard
  const handleShowPayment = (bookingData) => {
    setBookingDetails(bookingData); // <-- Save all data from wizard
    setAppStep('pay');
  };

  // 2. Called by PaymentForm
  const handlePaymentSuccess = async () => {
    setBookingMessage('Payment successful! Creating your appointment...');
    try {
      // Call API with all booking data
      const res = await fetch('http://localhost:5001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        // --- THIS IS THE FIX ---
        // Send the complete bookingDetails object, not selectedSpecialty
        body: JSON.stringify(bookingDetails), 
      });

      const newAppointment = await res.json();
      if (!res.ok) {
        throw new Error(newAppointment.message || 'Failed to create appointment');
      }

      setCurrentAppointment(newAppointment); 
      setAppStep('confirm'); // <-- Go to confirmation page
      setBookingMessage('');

    } catch (err) {
      setBookingMessage(`Error: ${err.message}`);
    }
  };

  // 3. Called by BookingConfirmation
  const handleConfirmDone = () => {
    setView('upcoming'); // Go to upcoming tab
    setAppStep('select');
    setBookingDetails(null);
    setCurrentAppointment(null);
  };

  // 4. onJoinCall is now passed in from App.js
  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Welcome to your Dashboard, {userInfo.name}!</h2>
      <p>Your email: {userInfo.email}</p>
      
      {/* --- TAB BUTTONS --- */}
      <div style={tabContainerStyle}>
        <button style={view === 'new' ? activeTabButtonStyle : tabButtonStyle} onClick={showNew}>
          Book New Appointment
        </button>
        <button style={view === 'upcoming' ? activeTabButtonStyle : tabButtonStyle} onClick={showUpcoming}>
          Upcoming
        </button>
        <button style={view === 'past' ? activeTabButtonStyle : tabButtonStyle} onClick={showPast}>
          Past & Completed
        </button>
      </div>

      <hr style={{ margin: '2rem 0', borderColor: '#555' }} />

      {/* --- TAB CONTENT --- */}

      {/* --- "BOOK NEW" TAB (holds the wizard) --- */}
      {view === 'new' && (
        <div>
          {appStep === 'select' && (
            <AppointmentWizard 
              onShowPayment={handleShowPayment}
              userInfo={userInfo} 
            />
          )}
          {appStep === 'pay' && (
            <PaymentForm 
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
          {appStep === 'confirm' && currentAppointment && (
            <BookingConfirmation
              appointment={currentAppointment}
              onDone={handleConfirmDone}
            />
          )}
          {/* The 'call' step is now handled by App.js */}
          {bookingMessage && <p>{bookingMessage}</p>}
        </div>
      )}

      {/* --- "UPCOMING" TAB --- */}
      {view === 'upcoming' && (
        <div>
          <h3>Your Upcoming Appointments</h3>
          <UpcomingAppointments 
            userInfo={userInfo} 
            onJoinCall={onJoinCall} // <-- Pass prop from App.js
            key={view} 
          />
        </div>
      )}

      {/* --- "PAST" TAB --- */}
      {view === 'past' && (
        <div>
          <h3>Your Past Appointments</h3>
          <PastAppointments userInfo={userInfo} />
        </div>
      )}

      {/* --- END TAB CONTENT --- */}

      <hr style={{ margin: '2rem 0', borderColor: '#555' }} />

      <button 
        onClick={onLogout} 
        style={{ padding: '0.5rem 1rem', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;