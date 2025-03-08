import React from 'react';

const TempoSelector = ({ currentQpm, setCurrentQpm, stop }) => {
  const handleTempoChange = (event) => {
    const selectedQpm = parseInt(event.target.value, 10);
    setCurrentQpm(selectedQpm);
    stop();
  };

  return (
    <div className="tempo-selector">
      <label htmlFor="tempo-select">Tempo: </label>
      <select id="tempo-select" onChange={handleTempoChange} value={currentQpm}>
      <option value="">inherit</option>
        <option value="30">30</option>
        <option value="60">60</option>
        <option value="90">90</option>
        <option value="120">120</option>
        <option value="180">180</option>
        <option value="240">240</option>
      </select>
    </div>
  );
};

export default TempoSelector;
