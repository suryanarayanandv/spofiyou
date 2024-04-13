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
    var expiryTime = new Date().getTime() + parseInt(expiresIn) * 1000;
    if (expiryTime < new Date().getTime()) {
        localStorage.removeItem('youtube_accessToken');
        localStorage.removeItem('youtube_tokenType');
        localStorage.removeItem('youtube_expiresIn');
        window.location.href = 'http://localhost:5500/youtube/auth.html';
    }
}

if (spotifyAccessToken && spotifyExpiresIn) {
    var expiryTime = new Date().getTime() + parseInt(expiresIn) * 1000;
    if (expiryTime < new Date().getTime()) {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_type');
        localStorage.removeItem('spotify_expires_in');
        window.location.href = 'http://localhost:5500/spotify/auth.html';
    }
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