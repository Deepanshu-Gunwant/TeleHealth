import React from 'react';
import { PaymentForm as SquarePaymentForm, CreditCard } from 'react-square-web-payments-sdk';

// Helper style for the form
const formStyle = {
  padding: '2rem',
  margin: '2rem 0',
  border: '1px solid #007bff',
  borderRadius: '8px',
  backgroundColor: '#f7f7f7',
  color: '#333'
};

/**
 * This is the main PaymentForm component.
 * It wraps the Square SDK's form.
 * * @param {function} onPaymentSuccess - A function to call when payment is successful.
 */
function PaymentForm({ onPaymentSuccess }) {

  // We'll hardcode the consultation fee to $10 (1000 cents)
  const consultationFee = 1000; // = $10.00 USD

  // This function is called by the Square SDK when it gets a payment token.
  // We then send this token to *our* backend to process the charge.
  const handleCreateToken = async (token) => {
    try {
      console.log('Got payment token from Square:', token.token);

      const response = await fetch('http://localhost:5001/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: token.token, // This is the payment token
          amount: consultationFee, // Amount in cents
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Payment Successful:', data.payment);
        alert('Payment Successful! Preparing your consultation...');
        onPaymentSuccess(); // Tell the parent component to move to the next step
      } else {
        console.error('Payment Failed on Backend:', data.message);
        alert(`Payment processing failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Server error:', error);
      alert('Could not connect to payment server.');
    }
  };

  return (
    <div style={formStyle}>
      <h3>Confirm Consultation Payment</h3>
      <p>Please enter your card details to pay the **$10.00** consultation fee.</p>

      <SquarePaymentForm
        // These are your public sandbox keys from the .env file
        applicationId={process.env.REACT_APP_SQUARE_APP_ID}
        locationId={process.env.REACT_APP_SQUARE_LOCATION_ID}

        // This function creates the token
        cardTokenizeResponseReceived={handleCreateToken}

        // This defines the "Pay" button
        createVerificationDetails={() => ({
          amount: '10.00',
          currencyCode: 'USD',
          intent: 'CHARGE',
          billingContact: {
            // You can add more fields here if needed
            email: 'test-patient@example.com',
          },
        })}
      >
        {/* This is the pre-built Credit Card input field */}
        <CreditCard />

      </SquarePaymentForm>
    </div>
  );
}

export default PaymentForm;