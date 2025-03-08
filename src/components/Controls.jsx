import React, { useEffect, useState } from 'react';
import ResetButton from './ResetButton';
import TuneButton from './TuneButton';

const Controls = ({ beginCountdown, stop, isPlaying, countdown }) => {
  const [buttonText, setButtonText] = useState('Start');

  useEffect(() => {
    setButtonText(isPlaying ? 'Stop' : 'Start');
  }, [isPlaying]);

  const handleStartClick = () => {
    if (isPlaying) {
      stop();
    } else {
      beginCountdown();
    }
  };

  return (
    <div className="controls">
      <button onClick={handleStartClick}>{buttonText}</button>
      {countdown > 0 && (
        <div className="countdown-display" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '4rem',
          color: '#222',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1000,
          textAlign: 'center'
        }}>
          Countdown: {countdown}
        </div>
      )}
    </div>
  );
};

export default Controls;
