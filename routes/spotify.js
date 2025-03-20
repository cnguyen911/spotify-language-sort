const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

router.get('/login', spotifyController.login);
router.get('/callback', spotifyController.callback);
router.get('/refresh-token', spotifyController.refreshToken);

router.get('/playlists', spotifyController.getUserPlaylists);
router.get('/playlist/:id', spotifyController.getPlaylistTracks);
router.post('/create-playlists', spotifyController.createLanguagePlaylists);

module.exports = router;