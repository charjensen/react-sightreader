import React from 'react';

const ABCEditor = ({ abcString, setAbcString, isTextAreaVisible }) => {
  if (!isTextAreaVisible) return null;

  return (
    <div className="abc-editor">
      <textarea
        value={abcString}
        onChange={(e) => setAbcString(e.target.value)}
        placeholder="Enter ABC or PLS notation manually"
        style={{ width: '100%', height: '200px' }}
      />
    </div>
  );
};

export default ABCEditor;
