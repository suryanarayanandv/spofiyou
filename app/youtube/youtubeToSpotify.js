{
    if (localStorage.getItem('youtube_accessToken') && localStorage.getItem('youtube_expiresIn')) {
        var expiryTime = new Date().getTime() + parseInt(localStorage.getItem('youtube_expiresIn')) * 1000;
        if (expiryTime < new Date().getTime()) {
            localStorage.removeItem('youtube_accessToken');
            localStorage.removeItem('youtube_token_type');
            localStorage.removeItem('youtube_expiresIn');
            window.location.href = 'http://localhost:5500/spotify/auth.html';
        }
    }

    // Get current user's playlists
    getCurrentYoutubeUserPlaylists(localStorage.getItem('youtube_accessToken')).then((data) => {
        var playlists = data;
        var playlistList = document.getElementById('playlist-list');

        if (playlists.length === 0) {
            playlistList.innerHTML = '<p>No playlists found</p>';
            return;
        }

        playlists.forEach(playlist => {
            var playlistItem = document.createElement('li');
            playlistItem.innerHTML = `
                Playlist: ${playlist.snippet.title} <button>Clone</button><br><hr><br>
            `;
            playlistItem.firstElementChild.addEventListener('click', function() {
                addPlaylistTracksToSpotify(playlist).catch((error) => {
                    if (error.response.status === 401) {
                        localStorage.removeItem('spotify_access_token');
                        localStorage.removeItem('spotify_token_type');
                        localStorage.removeItem('spotify_expires_in');
                        window.location.href = 'http://localhost:5500/spotify/auth.html';
                    }
                });
            });
            playlistList.appendChild(playlistItem);
        });
    });
}