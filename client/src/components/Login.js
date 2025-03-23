// client/src/components/Login.js
import React from 'react';

function Login() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleLogin = () => {
    window.location.href = `${API_URL}/spotify/login`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-spotify-black">
      <div className="bg-neutral p-8 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold text-spotify-green mb-4">Welcome to Language Sorter</h2>
        <p className="text-spotify-grey mb-6">This app helps you organize your Spotify playlists by language. It will analyze your playlist and create separate playlists for each language detected.</p>
        <button 
          className="bg-spotify-green hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full transition-all"
          onClick={handleLogin}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

export default Login;