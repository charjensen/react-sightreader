// useFileSelector.js
import { useState } from 'react';

const useFileSelector = () => {
  const [abcString, setAbcString] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAbcString(e.target.result);
      reader.readAsText(file);
    }
  };

  return { abcString, handleFileChange };
};

export default useFileSelector;