// client/src/utils/auth.js
import { apiService } from '../services/apiService';

export const getTokenFromUrl = () => {
  const hashParams = new URLSearchParams(window.location.search);
  const params = {};
  
  for (const [key, value] of hashParams.entries()) {
    params[key] = value;
  }
  
  return params;
};

export const setTokens = (accessToken, refreshToken, expiresIn) => {
  const expiration = Date.now() + (expiresIn * 1000);
  
  localStorage.setItem('spotify_tokens', JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    expiration
  }));
};

export const getTokens = () => {
  const tokens = JSON.parse(localStorage.getItem('spotify_tokens'));
  
  if (!tokens) return null;
  
  // Check if token is expired
  if (Date.now() > tokens.expiration) {
    // Refresh token
    refreshAccessToken(tokens.refresh_token);
    return null;
  }
  
  return tokens;
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await apiService.refreshToken(refreshToken);
    
    const { access_token, expires_in } = response;
    
    // Update tokens in localStorage
    const tokens = JSON.parse(localStorage.getItem('spotify_tokens'));
    const expiration = Date.now() + (expires_in * 1000);
    
    localStorage.setItem('spotify_tokens', JSON.stringify({
      ...tokens,
      access_token,
      expires_in,
      expiration
    }));
    
    // Reload the page to use the new token
    window.location.reload();
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Clear tokens and redirect to login
    localStorage.removeItem('spotify_tokens');
    window.location.href = '/';
  }
};