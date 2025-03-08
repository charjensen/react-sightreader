import React from 'react';

const FileSelector = ({
  setAbcString,
  setTunebook,
  setIsTextAreaVisible,
  setIsNotationVisible,
  setIsPlayListVisible,
}) => {
  const handleFileSelect = (e) => {
    const fileName = e.target.value;
    if (!fileName) {
      setIsTextAreaVisible(true);
      setIsNotationVisible(false);
      setAbcString('');
      return;
    }

    if (fileName.endsWith('.pls')) {
      setIsPlayListVisible(true);
      setIsNotationVisible(false);
      fetch(`/music/${fileName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Unable to load playlist file');
          }
          return response.text();
        })
        .then((rawData) => {
          // Process playlist data as needed.
          console.log('Loaded playlist file:', fileName);
        })
        .catch((error) => console.error(error));
    } else if (fileName.endsWith('.abc')) {
      setIsNotationVisible(true);
      setIsPlayListVisible(false);
      fetch(`/music/${fileName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Unable to load ABC file');
          }
          return response.text();
        })
        .then((rawData) => {
          const lines = rawData.split('\n');
          const headers = [];
          const notes = [];
          lines.forEach((line) => {
            line = line.trim();
            if (!line || line.startsWith('%')) return;
            if (line.length >= 2 && line[1] === ':' && /^[A-Za-z]$/.test(line[0])) {
              const headerChar = line[0].toUpperCase();
              if (!['T', 'C', 'Z', 'S', 'N', 'G', 'O', 'H', 'I', 'P', 'W', 'F', 'B'].includes(headerChar)) {
                headers.push(line);
              }
            } else {
              notes.push(line);
            }
          });
          const processedData = headers.join('\n') + '\n' + notes.join('\n');
          setAbcString(processedData);
          setIsTextAreaVisible(false);
        })
        .catch((error) => {
          console.error(error);
          setIsTextAreaVisible(true);
        });
    }
  };

  return (
    <div className="file-selector">
      <label htmlFor="file-select">File:</label>
      <select id="file-select" onChange={handleFileSelect}>
        <option value="">---Custom ABC---</option>
        <option value="beginner.pls">beginner.pls</option>
        <option value="cecilio-lesson1-open-strings.abc">cecilio-lesson1-open-strings.abc</option>
        <option value="cecilio-lesson2-first-position.abc">cecilio-lesson2-first-position.abc</option>
        <option value="cecilio-lesson2-twinkle-twinkle-little-star.abc">
          cecilio-lesson2-twinkle-twinkle-little-star.abc</option>
        <option value="cecilio-lesson3-exercise-1.abc">cecilio-lesson3-exercise-1.abc</option>
        <option value="cecilio-lesson3-exercise-2.abc">cecilio-lesson3-exercise-2.abc</option>
        <option value="cecilio-lesson3-exercise-3.abc">cecilio-lesson3-exercise-3.abc</option>
        <option value="cecilio-lesson3-exercise-4.abc">cecilio-lesson3-exercise-4.abc</option>
        <option value="cecilio-lesson3-jingle-bells.abc">cecilio-lesson3-jingle-bells.abc</option>
        <option value="cecilio-lesson3-mary-had-a-little-lamb.abc">
          cecilio-lesson3-mary-had-a-little-lamb.abc</option>
        <option value="cecilio-lesson4-camptown-races.abc">cecilio-lesson4-camptown-races.abc</option>
        <option value="cecilio-lesson4-lightly-row.abc">cecilio-lesson4-lightly-row.abc</option>
        <option value="cecilio-lesson4-russian-dance-tune.abc">cecilio-lesson4-russian-dance-tune.abc
        </option>
        <option value="cecilio-lesson5-eighth-notes.abc">cecilio-lesson5-eighth-notes.abc</option>
        <option value="cecilio-lesson5-hungarian-folk-song-1.abc">cecilio-lesson5-hungarian-folk-song-1.abc
        </option>
        <option value="cecilio-lesson5-the-old-gray-goose.abc">cecilio-lesson5-the-old-gray-goose.abc
        </option>
        <option value="cecilio-lesson6-first-position-d-string.abc">
          cecilio-lesson6-first-position-d-string.abc</option>
        <option value="cecilio-lesson6-ode-to-joy.abc">cecilio-lesson6-ode-to-joy.abc</option>
        <option value="cecilio-lesson6-scherzando.abc">cecilio-lesson6-scherzando.abc</option>
        <option value="cecilio-lesson7-can-can.abc">cecilio-lesson7-can-can.abc</option>
        <option value="cecilio-lesson7-country-gardens.abc">cecilio-lesson7-country-gardens.abc</option>
        <option value="cecilio-lesson7-gavotte.abc">cecilio-lesson7-gavotte.abc</option>
        <option value="cecilio-lesson8-dixie.abc">cecilio-lesson8-dixie.abc</option>
        <option value="cecilio-lesson8-largo.abc">cecilio-lesson8-largo.abc</option>
        <option value="hot-cross-buns.abc">hot-cross-buns.abc</option>
        <option value="lesson1-open-string-exercise-1.abc">lesson1-open-string-exercise-1.abc</option>
        <option value="lesson1-open-string-exercise-2.abc">lesson1-open-string-exercise-2.abc</option>
        <option value="lesson1-open-string-exercise-3.abc">lesson1-open-string-exercise-3.abc</option>
        <option value="lesson1-open-string-exercise-4.abc">lesson1-open-string-exercise-4.abc</option>
        <option value="lesson1-open-string-exercise-5.abc">lesson1-open-string-exercise-5.abc</option>
        <option value="lesson1-open-string-exercise-6.abc">lesson1-open-string-exercise-6.abc</option>
        <option value="lesson2-1st-finger-exercise-1.abc">lesson2-1st-finger-exercise-1.abc</option>
        <option value="lesson2-1st-finger-exercise-2.abc">lesson2-1st-finger-exercise-2.abc</option>
        <option value="lesson2-1st-finger-exercise-3.abc">lesson2-1st-finger-exercise-3.abc</option>
        <option value="lesson2-1st-finger-exercise-4.abc">lesson2-1st-finger-exercise-4.abc</option>
        <option value="lesson2-1st-finger-exercise-5.abc">lesson2-1st-finger-exercise-5.abc</option>
        <option value="lesson2-1st-finger-exercise-6.abc">lesson2-1st-finger-exercise-6.abc</option>
      </select>
    </div>
  );
};

export default FileSelector;
