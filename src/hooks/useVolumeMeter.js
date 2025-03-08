import { useEffect, useRef, useState } from 'react';
import { createAudioMeter } from '../utils/volume-meter';

const useVolumeMeter = () => {
  const audioContext = useRef(null);
  const meter = useRef(null);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const source = audioContext.current.createMediaStreamSource(stream);
        meter.current = createAudioMeter(audioContext.current);

        source.connect(meter.current);

        const updateVolume = () => {
          setVolume(meter.current.volume.toFixed(2));
          requestAnimationFrame(updateVolume);
        };

        updateVolume();
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });

    return () => {
      if (meter.current) meter.current.shutdown();
      if (audioContext.current) audioContext.current.close();
    };
  }, []);

  return volume;
};

export default useVolumeMeter;
