import React, { useState, useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

// (Styles)
const videoContainerStyle = {
  width: '800px',
  height: '500px',
  border: '1px solid #555'
};
const transcriptionStyle = {
  height: '100px',
  overflowY: 'scroll',
  border: '1px solid #555',
  padding: '10px',
  margin: '1rem 0',
  backgroundColor: '#f9f9f9',
  color: '#333',
  textAlign: 'left'
};
const buttonStyle = {
  backgroundColor: 'red',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

function VideoCall({ roomUrl, onLeaveCall }) {
  const videoRef = useRef(null);
  const callObject = useRef(null);
  
  // --- THIS IS THE FIX ---
  // We use this ref as a "lock" to prevent a second mount
  // from running the create/join logic.
  const isCallCreating = useRef(false);
  
  const [transcription, setTranscription] = useState('');

  // Store the onLeaveCall function in a ref to keep it stable
  const onLeaveCallRef = useRef(onLeaveCall);
  useEffect(() => {
    onLeaveCallRef.current = onLeaveCall;
  }, [onLeaveCall]);

  useEffect(() => {
    if (!videoRef.current || !roomUrl) {
      return; 
    }

    // --- GUARD CLAUSE ---
    // If a call is already being created, do nothing.
    // This stops the Strict Mode double-mount.
    if (isCallCreating.current) {
      return;
    }
    // --- END GUARD CLAUSE ---
    
    // Set the lock
    isCallCreating.current = true;

    // --- Define Event Handlers ---
    const handleJoinedMeeting = () => {
      callObject.current?.startTranscription();
    };
    const handleTranscription = (event) => {
      setTranscription(prev => `${prev} ${event.message.text}`);
    };
    const handleLeftMeeting = () => {
      onLeaveCallRef.current(); 
    };

    // --- Create the call frame ---
    const co = DailyIframe.createFrame(videoRef.current, {
      showLeaveButton: true,
      showParticipantsBar: true,
      showChat: true,
    });
    
    callObject.current = co;

    co.on('joined-meeting', handleJoinedMeeting);
    co.on('left-meeting', handleLeftMeeting);
    co.on('transcription-message', handleTranscription);

    co.join({ url: roomUrl });

    // --- Cleanup function ---
    return () => {
      if (callObject.current) {
        callObject.current.off('joined-meeting', handleJoinedMeeting);
        callObject.current.off('left-meeting', handleLeftMeeting);
        callObject.current.off('transcription-message', handleTranscription);
        
        // Use a small timeout to let the unmount complete
        // before the next mount starts (in Strict Mode)
        setTimeout(() => {
          callObject.current?.destroy();
          callObject.current = null;
          isCallCreating.current = false; // Release the lock
        }, 50); 
      }
    };
  }, [roomUrl]); // This effect ONLY runs when roomUrl changes


  const handleOurLeaveButton = () => {
    callObject.current?.leave();
  };

  return (
    <div>
      <div ref={videoRef} style={videoContainerStyle} />
      
      <div style={transcriptionStyle}>
        <strong>Transcription:</strong>
        <p>{transcription || 'Transcription will appear here...'}</p>
      </div>

      <button onClick={handleOurLeaveButton} style={buttonStyle}>
        Leave Call (Backup)
      </button>
    </div>
  );
}

export default VideoCall;