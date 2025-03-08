// useControls.js
import { useState, useCallback } from 'react';

const useControls = () => {
    const [isRunning, setIsRunning] = useState(false);

    const onStart = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const onReset = useCallback(() => {
        setIsRunning(false);
    }, []);

    const onTune = useCallback(() => {
        console.log('Tuning initiated...');

        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const source = window.audioContext.createMediaStreamSource(stream);
                const pitchDetector = new window.Pitchfinder.AMDF();

                const analyser = window.audioContext.createAnalyser();
                analyser.fftSize = 2048;
                source.connect(analyser);

                const buffer = new Float32Array(analyser.fftSize);

                const detectPitch = () => {
                    analyser.getFloatTimeDomainData(buffer);
                    const pitch = pitchDetector(buffer, window.audioContext.sampleRate);
                    console.log(`Detected pitch: ${pitch ? pitch.toFixed(2) : 'No pitch detected'}`);

                    if (isRunning) {
                        requestAnimationFrame(detectPitch);
                    }
                };

                detectPitch();
            })
            .catch((err) => {
                console.error('Error accessing microphone for tuning:', err);
            });
    }, [isRunning]);

    return { isRunning, onStart, onReset, onTune };
};

export default useControls;
