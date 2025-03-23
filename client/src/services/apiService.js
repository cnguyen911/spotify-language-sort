import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiService = {
  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.get(`${API_URL}/spotify/refresh-token`, {
        params: { refresh_token: refreshToken }
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
};