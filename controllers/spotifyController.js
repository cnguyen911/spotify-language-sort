const axios = require('axios');
const querystring = require('querystring');
const { detectLanguage } = require('../services/languageDetection5');

exports.login = (req, res) => {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5000/api/spotify/callback';
  
  console.log('Login function called - CLIENT_ID:', CLIENT_ID);
  
  if (!CLIENT_ID) {
    console.error('CLIENT_ID is missing or undefined');
    return res.status(500).send('Server configuration error: CLIENT_ID is missing');
  }
  
  const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';
  
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI
    }));
};

exports.callback = async (req, res) => {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5000/api/spotify/callback';
  const FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
  
  const code = req.query.code || null;
  
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const queryParams = querystring.stringify({
      access_token,
      refresh_token,
      expires_in
    });

    res.redirect(`${FRONTEND_URI}?${queryParams}`);
  } catch (error) {
    res.redirect(`${FRONTEND_URI}?error=invalid_token`);
  }
};

exports.refreshToken = async (req, res) => {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  
  const { refresh_token } = req.query;
  
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to refresh token' });
  }
};

exports.getUserPlaylists = async (req, res) => {
  const { access_token } = req.query;
  
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch playlists' });
  }
};

exports.getPlaylistTracks = async (req, res) => {
  const { access_token } = req.query;
  const { id } = req.params;
  
  try {
    const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const playlistName = playlistResponse.data.name;
    let tracks = [];
    let nextUrl = `https://api.spotify.com/v1/playlists/${id}/tracks`;
    
    while (nextUrl) {
      const tracksResponse = await axios.get(nextUrl, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      
      tracks = [...tracks, ...tracksResponse.data.items];
      nextUrl = tracksResponse.data.next;
    }
    
    const tracksWithLanguage = await Promise.all(
      tracks.map(async (item) => {
        const track = item.track;
        if (!track || track.is_local) return null;
        
        const trackName = track.name;
        const artistName = track.artists.map(artist => artist.name).join(' ');
        
        const language = await detectLanguage(trackName, artistName);
        
        return {
          id: track.id,
          name: trackName,
          artists: track.artists,
          uri: track.uri,
          language
        };
      })
    );
    
    const validTracks = tracksWithLanguage.filter(track => track !== null);
    
    const tracksByLanguage = validTracks.reduce((acc, track) => {
      if (!acc[track.language]) {
        acc[track.language] = [];
      }
      acc[track.language].push(track);
      return acc;
    }, {});
    
    res.json({
      playlistName,
      tracksByLanguage
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to fetch playlist tracks' });
  }
};

exports.createLanguagePlaylists = async (req, res) => {
  const FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
  
  const { access_token } = req.query;
  const { originalPlaylistName, tracksByLanguage } = req.body;
  
  try {
    const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const userId = profileResponse.data.id;
    const results = [];
    
    for (const [language, tracks] of Object.entries(tracksByLanguage)) {
      if (tracks.length === 0) continue;
      
      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: `${originalPlaylistName} - ${language}`,
          description: `Songs in ${language} from ${originalPlaylistName}`,
          public: false
        },
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const playlistId = playlistResponse.data.id;
      
      const trackUris = tracks.map(track => track.uri);
      for (let i = 0; i < trackUris.length; i += 100) {
        const batch = trackUris.slice(i, i + 100);
        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: batch
          },
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      results.push({
        language,
        playlistId,
        playlistName: playlistResponse.data.name,
        trackCount: tracks.length
      });
    }
    
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create language playlists' });
  }
};