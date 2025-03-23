# Spotify Language Playlist Sorter

A full-stack web application that automatically categorizes Spotify playlists by language, allowing users to organize their music based on linguistic content.

![Spotify Language Sorter Banner](https://user-images.githubusercontent.com/your-username/your-repo/banner-image.png)

## Features

- **Language Detection**: Automatically identifies 30+ languages in song titles and artist names
- **Playlist Organization**: Creates separate playlists for each detected language
- **Manual Override**: Interactive editor to review and refine language classifications
- **Spotify Integration**: Seamless connection with your Spotify account
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS with custom animations
- Axios for API requests

### Backend
- Node.js
- Express.js
- RESTful API architecture
- Language detection algorithm

### Integration
- Spotify Web API
- OAuth 2.0 Authentication

## Screenshots

![Login Screen](https://user-images.githubusercontent.com/your-username/your-repo/login-screen.png)
*Login screen with Spotify authentication*

![Playlist Selection](https://user-images.githubusercontent.com/your-username/your-repo/playlist-selection.png)
*Select from your existing Spotify playlists*

![Language Detection Results](https://user-images.githubusercontent.com/your-username/your-repo/language-detection.png)
*Review detected languages and track distribution*

![Language Editor](https://user-images.githubusercontent.com/your-username/your-repo/language-editor.png)
*Edit language classifications manually if needed*

## Usage

1. Log in with your Spotify account
2. Select a playlist you want to organize by language
3. Review the detected languages for each track
4. (Optional) Edit any misclassified tracks
5. Click "Create Language Playlists"
6. Check your Spotify account for the newly created playlists

## Future Enhancements

- [ ] Improve language detection accuracy with machine learning
- [ ] Add support for lyrics-based language detection
- [ ] Implement batch processing for very large playlists
- [ ] Add more customization options for playlist creation
- [ ] Support for additional music streaming platforms

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing access to music data
- [React.js](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [franc-min](https://github.com/wooorm/franc) for language detection capabilities

