const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const spotify = require('./routes/spotify');

// at the top of server.js
const path = require('path');
console.log('Current working directory:', process.cwd());
console.log('Looking for .env file at:', path.join(process.cwd(), '.env'));

// ;oad environment variables
dotenv.config();

console.log('Environment variables loaded:');
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID);
console.log('REDIRECT_URI:', process.env.REDIRECT_URI);
console.log('PORT:', process.env.PORT);
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/spotify', spotify);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});