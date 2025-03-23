import React, { useState, useEffect } from 'react';
import PlaylistCard from './PlaylistCard';
import LanguageSorter from './LanguageSorter';
import { spotifyService } from '../services/spotifyService';
import './Dashboard.css';

function Dashboard({ token }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const fetchedPlaylists = await spotifyService.getUserPlaylists(token);
        setPlaylists(fetchedPlaylists);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Failed to load your playlists. Please try again.');
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleBack = () => {
    setSelectedPlaylist(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_tokens');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="loading">Loading your playlists...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {selectedPlaylist ? (
        <LanguageSorter 
          playlist={selectedPlaylist}
          token={token}
          onBack={handleBack}
        />
      ) : (
        <>
          <h2>Your Playlists</h2>
          <p>Select a playlist to sort by language:</p>
          
          <div className="playlists-grid">
            {playlists.map(playlist => (
              <PlaylistCard 
                key={playlist.id}
                playlist={playlist}
                onSelect={handlePlaylistSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;