/**
 * Utilities
 */

const addPlaylistTracksToSpotify = async (youtubePlaylistObject) => {
    var playlistName = youtubePlaylistObject.snippet.title;
    var playlistId = youtubePlaylistObject.id;

    var currentSpotifyUser = await getCurrentUserProfile(localStorage.getItem('spotify_access_token'));

    // Get youtube playlist tracks
    getYoutubePlaylistItems(playlistId, localStorage.getItem('youtube_accessToken')).then(async (data) => {
        var tracks = data.map(track => {
            return {
                //trim the song name with 16 characters
                //TODO: how can i find artist name from youtube? complex
                name: track.snippet.title.length > 16 ? track.snippet.title.substring(0, 16) : track.snippet.title,
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
            var musicIdList = [];
            for (const track of tracks) {
                try {
                    if (!track.name) {
                        continue;
                    }
                    if (track.artist === 'null' || track.artist === undefined) {
                        track.artist = '';
                    }
                    const searchResponse = await searchSpotifyTrack(track, localStorage.getItem('spotify_access_token'));
                    if (searchResponse.length === 0) {
                        console.log('No music found');
                        continue;
                    }
        
                    const musicId = searchResponse[0].uri;
                    console.log(musicId);
                    musicIdList.push(musicId);
                } catch (error) {
                    console.error('Error adding music to playlist', error);
                }
            }
            if (musicIdList.length === 0) {
                return;
            }
            console.log(spotifyPlaylist, musicIdList);
            await addMusicToSpotifyPlaylist(spotifyPlaylist.id, musicIdList, localStorage.getItem('spotify_access_token'));
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