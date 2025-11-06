import React, { useState } from 'react';

// (Styles - slightly updated)
const wizardStyle = {
  margin: '2rem 0',
  padding: '2rem',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  color: '#333',
  textAlign: 'left'
};
const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  margin: '0.5rem 0 1rem 0',
  fontSize: '1rem',
  boxSizing: 'border-box'
};
const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1rem',
  marginTop: '1rem'
};
const backButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  marginRight: '1rem'
};
const listStyle = {
  listStyle: 'none',
  padding: 0
};
const itemStyle = {
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
  marginBottom: '0.5rem',
  cursor: 'pointer',
  backgroundColor: '#fff'
};
const slotGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: '0.5rem'
};
const slotButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#fff',
  color: '#007bff',
  border: '1px solid #007bff'
};


function AppointmentWizard({ onShowPayment, userInfo }) {
  // --- STATE FOR THE WIZARD ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- STATE FOR COLLECTED DATA ---
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [intakeForm, setIntakeForm] = useState({
    age: '',
    gender: '',
    symptoms: '',
    medicationsAndAllergies: ''
  });

  // --- WIZARD NAVIGATION ---
  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);
  
  // --- STEP 1: Handle Specialty Selection ---
  const handleSpecialtyNext = async () => {
    if (!specialty) return setError('Please select a specialty.');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5001/api/doctors?specialty=${specialty}`);
      if (!res.ok) throw new Error('Could not fetch doctors.');
      const data = await res.json();
      if (data.length === 0) {
        setError('Sorry, no doctors are available for this specialty.');
      } else {
        setDoctors(data);
        handleNextStep();
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // --- STEP 2: Handle Doctor Selection ---
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    handleNextStep();
  };

  // --- STEP 3: Handle Date Selection ---
  const handleDateNext = async () => {
    if (!selectedDate) return setError('Please select a date.');
    setLoading(true);
    setError('');
    try {
      // Call API to get slots
      const res = await fetch(`http://localhost:5001/api/appointments/slots?doctorId=${selectedDoctor._id}&date=${selectedDate}`);
      if (!res.ok) throw new Error('Could not fetch available slots.');
      
      const data = await res.json();
      if (data.length === 0) {
        setError('Sorry, no slots are available for this date. Please try another.');
      } else {
        setAvailableSlots(data);
        handleNextStep();
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // --- STEP 4: Handle Slot Selection ---
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    handleNextStep();
  };

  // --- STEP 5: Handle Intake Form ---
  const handleIntakeChange = (e) => {
    setIntakeForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleIntakeSubmit = (e) => {
    e.preventDefault();
    const { age, gender, symptoms } = intakeForm;
    if (!age || !gender || !symptoms) {
      return setError('Please fill out all required fields.');
    }
    
    // --- WIZARD COMPLETE ---
    // Pass all collected data to the Dashboard
    onShowPayment({
      doctorId: selectedDoctor._id,
      appointmentDate: selectedSlot,
      age: Number(age),
      gender: gender,
      symptoms: symptoms,
      medicationsAndAllergies: intakeForm.medicationsAndAllergies || 'None provided'
    });
  };

  // --- RENDER WIZARD STEPS ---
  return (
    <div style={wizardStyle}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* --- STEP 1: SELECT SPECIALTY --- */}
      {step === 1 && (
        <div>
          <h3>Book a New Consultation (Step 1 of 5)</h3>
          <label htmlFor="specialty">Select a Specialty:</label>
          <select id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={inputStyle}>
            <option value="">-- Select a specialty --</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
            <option value="General Practice">General Practice</option>
          </select>
          <button onClick={handleSpecialtyNext} disabled={loading} style={buttonStyle}>
            {loading ? 'Finding Doctors...' : 'Find Doctors'}
          </button>
        </div>
      )}

      {/* --- STEP 2: SELECT DOCTOR --- */}
      {step === 2 && (
        <div>
          <button onClick={handlePrevStep} style={backButtonStyle}>Back</button>
          <h3 style={{marginTop: '1.5rem'}}>Select a Doctor (Step 2 of 5)</h3>
          <ul style={listStyle}>
            {doctors.map(doc => (
              <li key={doc._id} style={itemStyle} onClick={() => handleDoctorSelect(doc)}>
                <h4>Dr. {doc.name}</h4>
                <p>{doc.specialty}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- STEP 3: SELECT DATE --- */}
      {step === 3 && (
        <div>
          <button onClick={handlePrevStep} style={backButtonStyle}>Back</button>
          <h3 style={{marginTop: '1.5rem'}}>Select Date (Step 3 of 5)</h3>
          <p>Selected Doctor: Dr. {selectedDoctor.name}</p>
          <label htmlFor="date">Select Appointment Date:</label>
          <input 
            type="date" 
            id="date" 
            value={selectedDate}
            // Set min date to today
            min={new Date().toISOString().split('T')[0]} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleDateNext} disabled={loading} style={buttonStyle}>
            {loading ? 'Finding Slots...' : 'Find Available Slots'}
          </button>
        </div>
      )}

      {/* --- STEP 4: SELECT TIME SLOT --- */}
      {step === 4 && (
        <div>
          <button onClick={handlePrevStep} style={backButtonStyle}>Back</button>
          <h3 style={{marginTop: '1.5rem'}}>Select Time Slot (Step 4 of 5)</h3>
          <p>Available slots for {new Date(selectedDate).toLocaleDateString()}:</p>
          <div style={slotGridStyle}>
            {availableSlots.map(slot => (
              <button 
                key={slot} 
                style={slotButtonStyle}
                onClick={() => handleSlotSelect(slot)}
              >
                {/* Format time to be readable in local timezone */}
                {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- STEP 5: INTAKE FORM --- */}
      {step === 5 && (
        <form onSubmit={handleIntakeSubmit}>
          <button onClick={handlePrevStep} style={backButtonStyle}>Back</button>
          <h3 style={{marginTop: '1.5rem'}}>Patient Information (Step 5 of 5)</h3>
          
          <label htmlFor="age">Age: *</label>
          <input type="number" id="age" name="age" placeholder="e.g., 30" value={intakeForm.age} onChange={handleIntakeChange} style={inputStyle} required />

          <label htmlFor="gender">Gender: *</label>
          <select id="gender" name="gender" value={intakeForm.gender} onChange={handleIntakeChange} style={inputStyle} required>
            <option value="">-- Select a gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>

          <label htmlFor="symptoms">Primary Symptoms: *</label>
          <textarea id="symptoms" name="symptoms" placeholder="e.g., 'Persistent cough and fever.'" value={intakeForm.symptoms} onChange={handleIntakeChange} style={{...inputStyle, height: '80px'}} required />

          <label htmlFor="meds">Current Medications & Allergies: (Optional)</label>
          <textarea id="meds" name="medicationsAndAllergies" placeholder="e.g., 'Allergic to penicillin.'" value={intakeForm.medicationsAndAllergies} onChange={handleIntakeChange} style={{...inputStyle, height: '80px'}} />

          <button type="submit" style={buttonStyle}>
            Proceed to Payment
          </button>
        </form>
      )}
    </div>
  );
}

export default AppointmentWizard;