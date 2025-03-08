import React from 'react';

const ResetButton = ({ onReset }) => {
  return (<div class='resetbutton'>
    <button onClick={onReset}>Reset</button>
  </div>

  );
};

export default ResetButton;
