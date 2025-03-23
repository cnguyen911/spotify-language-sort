import React, { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotifyService';
import LanguageEditor from './LanguageEditor';
import './LanguageSorter.css';

function LanguageSorter({ playlist, token, onBack }) {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [createdPlaylists, setCreatedPlaylists] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editedTracksByLanguage, setEditedTracksByLanguage] = useState(null);

  useEffect(() => {
    const analyzePlaylist = async () => {
      try {
        setLoading(true);
        setAnalyzing(true);
        
        const data = await spotifyService.analyzePlaylist(playlist.id, token);
        console.log("Playlist data received:", data); 
        
        setPlaylistData(data);
        setLoading(false);
        setAnalyzing(false);
      } catch (error) {
        console.error('Error analyzing playlist:', error);
        setError('Failed to analyze playlist. Please try again.');
        setLoading(false);
        setAnalyzing(false);
      }
    };

    analyzePlaylist();
  }, [playlist.id, token]);

  const handleCreatePlaylists = async () => {
    try {
      setCreating(true);
      
      const trackData = editedTracksByLanguage || playlistData.tracksByLanguage;
      
      const results = await spotifyService.createLanguagePlaylists(
        token, 
        playlist.name, 
        trackData
      );
      
      setCreatedPlaylists(results);
      setCreating(false);
    } catch (error) {
      console.error('Error creating playlists:', error);
      setError('Failed to create language playlists. Please try again.');
      setCreating(false);
    }
  };

  const handleEdit = () => {
    setShowEditor(true);
  };

  const handleEditorSave = (newTracksByLanguage) => {
    setEditedTracksByLanguage(newTracksByLanguage);
    setShowEditor(false);
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
  };

  if (loading) {
    return (
      <div className="language-sorter">
        <button className="back-button" onClick={onBack}>Back to Playlists</button>
        <h2>Analyzing "{playlist.name}"</h2>
        <div className="loading-spinner"></div>
        <p>This may take a moment for larger playlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="language-sorter">
        <button className="back-button" onClick={onBack}>Back to Playlists</button>
        <div className="error">{error}</div>
      </div>
    );
  }

  const displayTracksByLanguage = editedTracksByLanguage || playlistData.tracksByLanguage;

  return (
    <div className="language-sorter">
      <button className="back-button" onClick={onBack}>Back to Playlists</button>
      
      <h2>Playlist: {playlist.name}</h2>
      
      {analyzing ? (
        <div className="analyzing">
          <div className="loading-spinner"></div>
          <p>Analyzing languages in your playlist...</p>
        </div>
      ) : showEditor ? (
        <LanguageEditor
          tracksByLanguage={playlistData.tracksByLanguage}
          onSave={handleEditorSave}
          onCancel={handleEditorCancel}
        />
      ) : (
        <>
          <div className="language-summary">
            <h3>Languages Detected</h3>
            <div className="language-list">
              {Object.entries(displayTracksByLanguage).map(([language, tracks]) => (
                <div className="language-item" key={language}>
                  <span className="language-name">{language}</span>
                  <span className="language-count">{tracks.length} tracks</span>
                </div>
              ))}
            </div>
            
            <div className="language-actions">
              <button onClick={handleEdit} className="edit-button">
                Edit Languages
              </button>
            </div>
          </div>
          
          {createdPlaylists.length > 0 ? (
            <div className="created-playlists">
              <h3>Created Playlists</h3>
              <ul className="playlist-results">
                {createdPlaylists.map(result => (
                  <li key={result.playlistId}>
                    <a 
                      href={`https://open.spotify.com/playlist/${result.playlistId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {result.playlistName}
                    </a>
                    <span className="track-count">({result.trackCount} tracks)</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <button 
              className="create-button" 
              onClick={handleCreatePlaylists}
              disabled={creating}
            >
              {creating ? 'Creating Playlists...' : 'Create Language Playlists'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default LanguageSorter;