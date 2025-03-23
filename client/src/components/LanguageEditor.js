import React, { useState } from 'react';
import './LanguageEditor.css';

const commonLanguages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Japanese', 'Korean', 'Chinese', 'Vietnamese', 'Russian', 'Arabic', 'Hindi',
  'Thai', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
  'Czech', 'Hungarian', 'Romanian', 'Turkish', 'Greek', 'Ukrainian',
  'Bulgarian', 'Traditional Chinese', 'Bengali', 'Tamil', 'Telugu', 'Kannada',
  'Malayalam', 'Filipino', 'Indonesian'
];

function LanguageEditor({ tracksByLanguage, onSave, onCancel }) {
  const [editedTracks, setEditedTracks] = useState(() => {
    const tracks = {};
    
    Object.entries(tracksByLanguage).forEach(([language, languageTracks]) => {
      languageTracks.forEach(track => {
        tracks[track.id] = {
          ...track,
          language
        };
      });
    });
    
    return tracks;
  });

  console.log("Tracks by language received:", tracksByLanguage);
  console.log("Initialized edited tracks:", editedTracks);

  const handleLanguageChange = (trackId, newLanguage) => {
    setEditedTracks(prev => ({
      ...prev,
      [trackId]: {
        ...prev[trackId],
        language: newLanguage
      }
    }));
  };

  const handleSave = () => {
    const newTracksByLanguage = {};
    
    Object.values(editedTracks).forEach(track => {
      if (!newTracksByLanguage[track.language]) {
        newTracksByLanguage[track.language] = [];
      }
      newTracksByLanguage[track.language].push(track);
    });
    
    onSave(newTracksByLanguage);
  };

  const allTracks = Object.values(editedTracks);

  const sortedLanguages = [...commonLanguages].sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="language-editor">
      <h3>Edit Language Classifications</h3>
      <p>Review and correct language classifications for better playlist sorting.</p>
      
      <div className="track-list">
        {allTracks.map(track => (
          <div key={track.id} className="track-item">
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-artists">
                {track.artists.map(artist => artist.name).join(', ')}
              </div>
            </div>
            
            <div className="track-language">
              <select 
                value={track.language}
                onChange={(e) => handleLanguageChange(track.id, e.target.value)}
              >
                {sortedLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
                <option value="Unknown">Unknown</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      
      <div className="editor-actions">
        <button className="cancel-button" onClick={onCancel}>Cancel</button>
        <button className="save-button" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default LanguageEditor;