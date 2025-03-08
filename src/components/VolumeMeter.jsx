import React, { useEffect, useState } from 'react';
import { createAudioMeter } from '../utils/volume-meter';

const VolumeMeter = ({ audioContext, monitoring }) => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    let meter;
    let intervalId;

    const startVolumeMeter = async () => {
      try {
        await audioContext.resume();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        meter = createAudioMeter(audioContext);
        source.connect(meter);
        intervalId = setInterval(() => {
          setVolume(Math.round(meter.volume * 100));
        }, 100);
      } catch (error) {
        console.error('Error initializing volume meter:', error);
      }
    };

    if (monitoring) {
      startVolumeMeter();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [audioContext, monitoring]);

  return (
    <div className="volume-meter">
      <p>Volume: {monitoring ? volume : '-'}</p>
    </div>
  );
};

export default VolumeMeter;
