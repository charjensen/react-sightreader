import React from 'react';

const PlaylistDisplay = ({ playlistFiles, currentPlaylistIndex, onSelectPlaylistItem, isPlayListVisible }) => {
  if (!isPlayListVisible) return null;

  return (
    <div className="playlist-display">
      <ol className="list-group">
        {playlistFiles.map((file, index) => (
          <li
            key={index}
            className={`list-group-item ${index === currentPlaylistIndex ? 'active' : ''}`}
            onClick={() => onSelectPlaylistItem(index)}
          >
            {file}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PlaylistDisplay;
