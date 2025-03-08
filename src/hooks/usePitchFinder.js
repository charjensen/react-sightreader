// usePitchFinder.js
import { useEffect, useRef, useState } from 'react';
import Pitchfinder from 'pitchfinder';

const usePitchFinder = (audioContext, selectedMicrophone = null) => {
  const analyser = useRef(null);
  const pitchDetector = useRef(null);
  const [pitch, setPitch] = useState(null);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!audioContext) {
      setError('AudioContext is not available');
      return;
    }

    pitchDetector.current = Pitchfinder.AMDF();

    const initPitchFinder = async () => {
      try {
        // Access microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: selectedMicrophone ? { deviceId: selectedMicrophone } : true,
        });
        streamRef.current = stream;

        const source = audioContext.createMediaStreamSource(stream);

        // Create analyser
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        analyser.current = analyserNode;
        source.connect(analyserNode);

        const buffer = new Float32Array(analyserNode.fftSize);

        const detectPitch = () => {
          analyserNode.getFloatTimeDomainData(buffer);

          try {
            const detectedPitch = pitchDetector.current(buffer, audioContext.sampleRate);
            setPitch(detectedPitch ? `${detectedPitch.toFixed(2)} Hz` : null);
          } catch (err) {
            console.error('Pitch detection error:', err);
          }

          requestAnimationFrame(detectPitch);
        };

        detectPitch();
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('Error accessing microphone');
      }
    };

    initPitchFinder();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (analyser.current) analyser.current.disconnect();
    };
  }, [audioContext, selectedMicrophone]);

  return { pitch, error };
};

export default usePitchFinder;
