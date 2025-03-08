import React, { useState, useRef, useEffect } from 'react';
import VolumeMeter from './components/VolumeMeter';
import NotationDisplay from './components/NotationDisplay';
import Controls from './components/Controls';
import MicrophoneSelector from './components/MicrophoneSelector';
import FileSelector from './components/FileSelector';
import ABCEditor from './components/ABCEditor';
import TempoSelector from './components/TempoSelector';
import PlaylistDisplay from './components/PlaylistDisplay';
import TuneButton from './components/TuneButton';
import PitchDisplay from './components/PitchDisplay';
import ResetButton from './components/ResetButton';
import Pitchfinder from 'pitchfinder';
import { createAudioMeter } from './utils/volume-meter';

function App() {
  const [abcString, setAbcString] = useState('');
  const [tunebook, setTunebook] = useState(null);
  const [currentQpm, setCurrentQpm] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [synthInstance, setSynthInstance] = useState(null);
  const [countdown, setCountdown] = useState(-1);
  const [isTextAreaVisible, setIsTextAreaVisible] = useState(true);
  const [isNotationVisible, setIsNotationVisible] = useState(false);
  const [isPlayListVisible, setIsPlayListVisible] = useState(false);
  const [playlistFiles, setPlaylistFiles] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Pitch display state
  const [expectedMidi, setExpectedMidi] = useState(0);
  const [detectedMidi, setDetectedMidi] = useState(0);

  // Shared monitoring state for pitch/volume detection.
  const [monitoring, setMonitoring] = useState(false);
  const [micVolume, setMicVolume] = useState('-');

  // Pitch detection ref to hold our objects.
  const pitchDetectionRef = useRef({});

  const audioContextRef = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );

  // Timing callback for ABCJS to update expected note and highlight it.
  const handleNoteEvent = (event) => {
    if (!event) {
      if (currentEvent && currentEvent.elements) {
        currentEvent.elements.forEach((group) =>
          group.forEach((elem) => elem.setAttribute('fill', '#000000'))
        );
      }
      setCurrentEvent(null);
      setExpectedMidi(0);
      return;
    }
    if (currentEvent && currentEvent.elements) {
      currentEvent.elements.forEach((group) =>
        group.forEach((elem) => elem.setAttribute('fill', '#000000'))
      );
    }
    if (event.elements) {
      event.elements.forEach((group) =>
        group.forEach((elem) => elem.setAttribute('fill', '#FF0000'))
      );
      setCurrentEvent(event);
    }
    if (event.midiPitches && event.midiPitches[0]) {
      setExpectedMidi(event.midiPitches[0].pitch);
    } else {
      setExpectedMidi(0);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCountdown(-1);
    if (synthInstance) {
      synthInstance.stop();
    }
    if (timer) {
      timer.stop();
      setTimer(null);
    }
  };

  const beginCountdown = () => {
    if (!tunebook || tunebook.length === 0) {
      console.error('No tunebook available');
      return;
    }
    const beatsPerMeasure = tunebook[0].getBeatsPerMeasure() || 4;
    setCountdown(beatsPerMeasure + 1);
  };

  // --- Pitch Detection Functions ---
  const startPitchDetection = async () => {
    try {
      await audioContextRef.current.resume();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pitchDetectionRef.current.sourceStream = stream;
      const sourceNode = audioContextRef.current.createMediaStreamSource(stream);

      pitchDetectionRef.current.volumeMeter = createAudioMeter(audioContextRef.current);
      sourceNode.connect(pitchDetectionRef.current.volumeMeter);

      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048;
      pitchDetectionRef.current.analyser = analyser;
      sourceNode.connect(analyser);

      const detectPitch = new Pitchfinder.YIN({ sampleRate: audioContextRef.current.sampleRate });
      pitchDetectionRef.current.pitchDetector = detectPitch;

      pitchDetectionRef.current.pitchGetterId = setInterval(() => {
        const vol = pitchDetectionRef.current.volumeMeter.volume;
        setMicVolume(vol > 0.01 ? Math.round(vol * 100) : '-');
        if (vol > 0.01) {
          const buffer = new Float32Array(analyser.fftSize);
          analyser.getFloatTimeDomainData(buffer);
          const freq = detectPitch(buffer);
          const midiNumber = freq ? Math.round(69 + 12 * Math.log2(freq / 440)) : 0;
          setDetectedMidi(midiNumber);
        } else {
          setDetectedMidi(0);
        }
      }, 10);
      setMonitoring(true);
    } catch (error) {
      console.error('Error starting pitch detection:', error);
    }
  };

  const stopPitchDetection = () => {
    if (pitchDetectionRef.current.pitchGetterId) {
      clearInterval(pitchDetectionRef.current.pitchGetterId);
    }
    if (pitchDetectionRef.current.sourceStream) {
      pitchDetectionRef.current.sourceStream.getTracks().forEach((track) => track.stop());
    }
    pitchDetectionRef.current = {};
    setMonitoring(false);
    setMicVolume('-');
    setDetectedMidi(0);
  };
  // --- End Pitch Detection Functions ---

  // Updated startPlayback that also restarts pitch detection.
  const startPlaybackWithPitch = () => {
    setIsPlaying(true);
    const audioContext = audioContextRef.current;
    const synth = new window.ABCJS.synth.CreateSynth();
    synth
      .init({
        audioContext,
        visualObj: tunebook[0],
        millisecondsPerMeasure:
          (60000 / currentQpm) * tunebook[0].getBeatsPerMeasure(),
      })
      .then(() => synth.prime())
      .then(() => {
        synth.start();
        setSynthInstance(synth);
        const timerInstance = new window.ABCJS.TimingCallbacks(tunebook[0], {
          qpm: currentQpm,
          extraMeasuresAtBeginning: 0,
          lineEndAnticipation: 0,
          beatSubdivisions: 4,
          eventCallback: handleNoteEvent,
        });
        timerInstance.start();
        setTimer(timerInstance);
        // Restart pitch detection.
        stopPitchDetection();
        startPitchDetection();
      })
      .catch((error) => console.error('Playback error:', error));
  };

  useEffect(() => {
    let timerId;
    if (countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      startPlaybackWithPitch();
    }
    return () => clearTimeout(timerId);
  }, [countdown]);

  const handleSelectPlaylistItem = (index) => {
    setCurrentPlaylistIndex(index);
    const fileName = playlistFiles[index];
    fetch(`/music/${fileName}`)
      .then((response) => response.text())
      .then((rawData) => {
        setAbcString(rawData);
        setIsTextAreaVisible(false);
        setIsNotationVisible(true);
      })
      .catch((error) => console.error(error));
  };

  // Reset handler: stops playback and pitch detection, resets pitch display and note highlights.
  const handleReset = () => {
    stopPlayback();
    stopPitchDetection();
    setExpectedMidi(0);
    setDetectedMidi(0);
    const notationContainer = document.querySelector('.notation-display');
    if (notationContainer) {
      const notes = notationContainer.querySelectorAll('.abcjs-note');
      notes.forEach((note) => note.setAttribute('fill', '#000000'));
    }
  };

  return (

    <div className="container" style={{ padding: '20px' }}>
      <h3>ABC SightReader</h3>
      {/* Top Row: Controls */}
      <div
        className="top-controls"
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <MicrophoneSelector />
        <FileSelector
          setAbcString={setAbcString}
          setTunebook={setTunebook}
          setIsTextAreaVisible={setIsTextAreaVisible}
          setIsNotationVisible={setIsNotationVisible}
          setIsPlayListVisible={setIsPlayListVisible}
        />
        <TempoSelector currentQpm={currentQpm} setCurrentQpm={setCurrentQpm} stop={stopPlayback} />
        <Controls
          beginCountdown={beginCountdown}
          stop={stopPlayback}
          isPlaying={isPlaying}
          countdown={countdown}
        />
        <ResetButton onReset={handleReset} />
        <TuneButton
          audioContext={audioContextRef.current}
          monitoring={monitoring}
          startPitchDetection={startPitchDetection}
          stopPitchDetection={stopPitchDetection}
        />
      </div>

      {/* Middle Section: Notation Display */}
      <div className="notation-section" style={{ marginBottom: '20px' }}>
        <NotationDisplay
          abcString={abcString}
          setTunebook={setTunebook}
          setCurrentQpm={setCurrentQpm}
          isNotationVisible={isNotationVisible}
        />
      </div>

      {/* Editor Section: ABC Editor */}
      <div className="editor-section" style={{ marginBottom: '20px' }}>
        <ABCEditor abcString={abcString} setAbcString={setAbcString} isTextAreaVisible={isTextAreaVisible} />
      </div>

      {/* Bottom Row: Pitch & Volume Display */}
      <div
        className="status-row"
        style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
      >
        <PitchDisplay expectedMidi={expectedMidi} detectedMidi={detectedMidi} />
        <VolumeMeter audioContext={audioContextRef.current} monitoring={monitoring} />
      </div>

      {/* Optional: Playlist can be positioned as needed */}
      <PlaylistDisplay
        playlistFiles={playlistFiles}
        currentPlaylistIndex={currentPlaylistIndex}
        onSelectPlaylistItem={handleSelectPlaylistItem}
        isPlayListVisible={isPlayListVisible}
      />
    </div>
  );
}

export default App;
