import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { getTokenFromUrl, setTokens } from './utils/auth';
import './App.css';

function App() {
 const [token, setToken] = useState(null);
 const [refreshToken, setRefreshToken] = useState(null);
 const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    const params = getTokenFromUrl();
    
    if (params.access_token) {
      setToken(params.access_token);
      setRefreshToken(params.refresh_token);
      setExpiresIn(params.expires_in);
      
      setTokens(
        params.access_token,
        params.refresh_token,
        params.expires_in
      );
      
      window.history.pushState({}, null, '/');
    } else {
      const tokens = JSON.parse(localStorage.getItem('spotify_tokens'));
      if (tokens && tokens.access_token) {
        // Add expiration check
        const isExpired = tokens.expiration && Date.now() > tokens.expiration;
        
        if (!isExpired) {
          setToken(tokens.access_token);
          setRefreshToken(tokens.refresh_token);
          setExpiresIn(tokens.expires_in);
        } else {
          // Clear expired tokens
          localStorage.removeItem('spotify_tokens');
        }
      }
    }
  }, []);

  const handleForceLogout = () => {
    // Clear tokens from state and localStorage
    setToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    localStorage.removeItem('spotify_tokens');
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Spotify Language Playlist Sorter</h1>
          {/* Debug logout button */}
          <button 
            onClick={handleForceLogout}
            style={{
              position: 'absolute',
              right: '20px',
              top: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Force Logout
          </button>
        </header>
        
        <main>
          <Routes>
            <Route 
              path="/" 
              element={token ? <Dashboard token={token} /> : <Login />} 
            />
          </Routes>
        </main>
        
        <footer>
          <p>© 2025 Spotify Language Playlist Sorter</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;