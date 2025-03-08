import React from 'react';

const TuneButton = ({ audioContext, monitoring, startPitchDetection, stopPitchDetection }) => {
  const toggleRecording = () => {
    if (monitoring) {
      stopPitchDetection();
    } else {
      startPitchDetection();
    }
  };

  return (
    <div className="tune-button">
      <button onClick={toggleRecording} className={monitoring ? 'active' : ''}>
        {monitoring ? 'Stop' : 'Tune'}
      </button>
    </div>
  );
};

export default TuneButton;
