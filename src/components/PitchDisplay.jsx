import React from 'react';
import { midiNumberToString } from '../utils/pitchutils';

const PitchDisplay = ({ expectedMidi, detectedMidi }) => {
  return (
    <div className="pitch-display">
      <p>Expected: {midiNumberToString(expectedMidi)}</p>
      <p>Detected: {midiNumberToString(detectedMidi)}</p>
    </div>
  );
};

export default PitchDisplay;
