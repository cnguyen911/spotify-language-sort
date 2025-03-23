import React from 'react';
import './PlaylistCard.css';

function PlaylistCard({ playlist, onSelect }) {
  const handleClick = () => {
    onSelect(playlist);
  };

  const playlistImage = playlist.images && playlist.images.length > 0
    ? playlist.images[0].url
    : '/default-playlist.png';

  return (
    <div className="playlist-card" onClick={handleClick}>
      <div className="playlist-image">
        <img src={playlistImage} alt={playlist.name} />
      </div>
      <div className="playlist-info">
        <h3>{playlist.name}</h3>
        <p>{playlist.tracks.total} tracks</p>
      </div>
    </div>
  );
}

export default PlaylistCard;