{
    if (localStorage.getItem('spotify_access_token') && localStorage.getItem('spotify_expires_in')) {
        var expiryTime = new Date().getTime() + parseInt(localStorage.getItem('spotify_expires_in')) * 1000;
        if (expiryTime < new Date().getTime()) {
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_token_type');
            localStorage.removeItem('spotify_expires_in');
            window.location.href = 'http://localhost:5500/spotify/auth.html';
        }
    }
    // Get current user details
    getCurrentUserProfile(localStorage.getItem('spotify_access_token')).then((data) => {
        document.getElementById('user-profile').innerHTML = `
            <h1>${data.display_name}</h1>
            <p>${data.email}</p>
        `;
    }).catch((error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_token_type');
            localStorage.removeItem('spotify_expires_in');
            window.location.href = 'http://localhost:5500/spotify/auth.html';
        }
    });

    // Get user's playlists
    getCurrentUserPlaylists(localStorage.getItem('spotify_access_token')).then((data) => {
        var playlists = data;
        var playlistList = document.getElementById('playlist-list');

        if (playlists.length === 0) {
            playlistList.innerHTML = '<p>No playlists found</p>';
            return;
        }

        playlists.forEach(playlist => {
            var playlistItem = document.createElement('li');
            playlistItem.innerHTML = `
                Playlist: ${playlist.name} <button>Clone</button><br><hr><br>
            `;
            playlistItem.firstElementChild.addEventListener('click', function() {
                addPlaylistTracksToYoutube(playlist).catch((error) => {
                    if (error.response.status === 401) {
                        localStorage.removeItem('youtube_accessToken');
                        localStorage.removeItem('youtube_tokenType');
                        localStorage.removeItem('youtube_expiresIn');
                        window.location.href = 'http://localhost:5500/youtube/auth.html';
                    }
                });
            });
            playlistList.appendChild(playlistItem);
        });
    });
}