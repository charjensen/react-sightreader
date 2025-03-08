import React, { useEffect, useRef } from 'react';

const NotationDisplay = ({ abcString, setTunebook, setCurrentQpm, isNotationVisible }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (abcString && isNotationVisible && containerRef.current) {
      let qpm = 120; // default tempo
      const tempoMatches = abcString.match(/Q:\s*(\d+)/i);
      if (tempoMatches) {
        qpm = parseInt(tempoMatches[1], 10);
        // Remove Q: tempo from ABC string so it isn’t rendered.
        abcString = abcString.replace(/Q:\s*(\d+\n)/i, '');
      }
      const renderedTunebook = window.ABCJS.renderAbc(containerRef.current, abcString, {
        responsive: 'resize',
        scale: 1.0,
        add_classes: true,
        staffwidth: 800,
      });
      setTunebook(renderedTunebook);
      setCurrentQpm(qpm);
    }
  }, [abcString, isNotationVisible, setTunebook, setCurrentQpm]);

  if (!isNotationVisible) return null;

  return <div ref={containerRef} className="notation-display" style={{ opacity: 0.5 }} />;
};

export default NotationDisplay;
