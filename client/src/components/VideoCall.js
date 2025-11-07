import React, { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

const videoContainerStyle = {
  width: '800px',
  height: '500px',
  border: '1px solid #555'
};

function VideoCall({ roomUrl, onLeaveCall }) {
  const videoRef = useRef(null);
  const callObject = useRef(null);

  useEffect(() => {
    if (!roomUrl || !videoRef.current) return;

    // Create the Daily call iframe
    const co = DailyIframe.createFrame(videoRef.current, {
      showLeaveButton: true,
    });

    callObject.current = co;

    // Join the shared room
    co.join({ url: roomUrl });

    co.on('left-meeting', () => {
      onLeaveCall();
    });

    return () => {
      co.destroy();
      callObject.current = null;
    };
  }, [roomUrl, onLeaveCall]);

  return (
    <div>
      <div ref={videoRef} style={videoContainerStyle} />
      <button
        onClick={() => callObject.current?.leave()}
        style={{ background: 'red', color: 'white', marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '5px' }}
      >
        Leave Call
      </button>
    </div>
  );
}

export default VideoCall;