import React, { useEffect, useState } from 'react';

const MicrophoneSelector = ({ setCurrentDevice }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const audioDevices = deviceInfos.filter((device) => device.kind === 'audioinput');
      setDevices(audioDevices);
    });
  }, []);

  return (
    <div className="microphone-selector">
      <label htmlFor="devices">Microphone:</label>
      <select id="devices" onChange={(e) => setCurrentDevice && setCurrentDevice(e.target.value)}>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MicrophoneSelector;
