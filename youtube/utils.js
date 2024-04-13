/**
 * Utilities
 */

const addPlaylistTracksToSpotify = async (youtubePlaylistObject) => {
    var playlistName = youtubePlaylistObject.snippet.title;
    var playlistId = youtubePlaylistObject.id;

    var currentSpotifyUser = await getCurrentUserProfile(localStorage.getItem('spotify_access_token'));

    // Get youtube playlist tracks
    getPlaylistTracks(playlistId, localStorage.getItem('youtube_accessToken')).then(async (data) => {
        var tracks = data.map(track => {
            return {
                name: track.snippet.title,
                artist: track.snippet.channelTitle
            };
        });

        console.log(tracks);

        // Add tracks to spotify playlist
        await addTracksToSpotifyPlaylist(tracks);
    });

    function addTracksToSpotifyPlaylist(tracks) {
        // Create spotify playlist
        createSpotifyPlaylist(currentSpotifyUser.id, playlistName, localStorage.getItem('spotify_access_token')).then(async (data) => {
            console.log(data);
            var spotifyPlaylist = data;
            
            for (const track of tracks) {
                try {
                    if (!track.name) {
                        continue;
                    }
                    if (track.artist === 'null' || track.artist === undefined) {
                        track.artist = '';
                    }
                    const searchResponse = await searchSpotifyMusic(track, localStorage.getItem('spotify_access_token'));
                    if (searchResponse.length === 0) {
                        console.log('No music found');
                        continue;
                    }
        
                    const musicId = searchResponse[0].id;
                    console.log(musicId);
                    const addResponse = await addMusicToSpotifyPlaylist(spotifyPlaylist.id, musicId, localStorage.getItem('spotify_access_token'));
                    console.log(addResponse);
                } catch (error) {
                    console.error('Error adding music to playlist', error);
                }
            }
        }).catch((error) => {
            if (error.response.status === 401) {
                localStorage.removeItem('spotify_access_token');
                localStorage.removeItem('spotify_token_type');
                localStorage.removeItem('spotify_expires_in');
                window.location.href = 'http://localhost:5500/spotify/auth.html';
            }
        });
    }
}