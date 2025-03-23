import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const spotifyService = {
  getUserPlaylists: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/spotify/playlists`, {
        params: { access_token: token }
      });
      return response.data.items;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  },

  analyzePlaylist: async (playlistId, token) => {
    try {
      const response = await axios.get(`${API_URL}/spotify/playlist/${playlistId}`, {
        params: { access_token: token }
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing playlist:', error);
      throw error;
    }
  },

  createLanguagePlaylists: async (token, originalPlaylistName, tracksByLanguage) => {
    try {
      const response = await axios.post(
        `${API_URL}/spotify/create-playlists`,
        {
          originalPlaylistName,
          tracksByLanguage
        },
        {
          params: { access_token: token }
        }
      );
      return response.data.results;
    } catch (error) {
      console.error('Error creating playlists:', error);
      throw error;
    }
  }
};