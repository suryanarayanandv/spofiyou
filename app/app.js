// check access_token expiry
var youtubeAccessToken = localStorage.getItem('youtube_accessToken');
var youtubeExpiresIn = localStorage.getItem('youtube_expiresIn');
var spotifyAccessToken = localStorage.getItem('spotify_access_token');
var spotifyExpiresIn = localStorage.getItem('spotify_expires_in');

if (!youtubeAccessToken)
{
    window.location.href = 'http://localhost:5500/youtube/auth.html';
}
else if (!spotifyAccessToken)
{
    window.location.href = 'http://localhost:5500/spotify/auth.html';
}

if (youtubeAccessToken && youtubeExpiresIn) {
    var expiryTime = new Date().getTime() + parseInt(youtubeExpiresIn) * 1000;
    if (new Date().getTime() > expiryTime) {
        localStorage.removeItem('youtube_accessToken');
        localStorage.removeItem('youtube_tokenType');
        localStorage.removeItem('youtube_expiresIn');
        window.location.href = 'http://localhost:5500/youtube/auth.html';
    }
}

if (spotifyAccessToken && spotifyExpiresIn) {
    var expiryTime = new Date().getTime() + parseInt(spotifyExpiresIn) * 1000;
    if (new Date().getTime() > expiryTime) {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_code');
        localStorage.removeItem('spotify_token_type');
        localStorage.removeItem('spotify_expires_in');
        window.location.href = 'http://localhost:5500/spotify/auth.html';
    }
}

var youtubeExpiryTime =
  new Date().getTime() +
  parseInt(localStorage.getItem("youtube_expiresIn")) * 1000;
var spotifyExpiryTime =
  new Date().getTime() +
  parseInt(localStorage.getItem("spotify_expires_in")) * 1000;
if (
  youtubeExpiryTime > new Date().getTime() &&
  spotifyExpiryTime > new Date().getTime()
) {
  document.getElementById('root').style.display = 'block';
}


const cleanupEnv = () => {
    localStorage.removeItem('youtube_accessToken');
    localStorage.removeItem('youtube_tokenType');
    localStorage.removeItem('youtube_expiresIn');
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_type');
    localStorage.removeItem('spotify_expires_in');
    window.location.href = 'http://localhost:5500/app/index.html';
}

const switchToSpotifyView = () => {
    window.location.href = 'http://localhost:5500/app/spotify/index.html';
}

const switchToYoutubeView = () => {
    window.location.href = 'http://localhost:5500/app/youtube/index.html';
}