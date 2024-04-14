/**
 * Utilities
 */
const addPlaylistTracksToYoutube = async (spotifyPlaylistObject) => {
    var playlistName = spotifyPlaylistObject.name;
    var playlistId = spotifyPlaylistObject.id;

    // Get spotify playlist tracks
    getPlaylistTracks(playlistId, localStorage.getItem('spotify_access_token')).then(async (data) => {
        var tracks = data.map(track => {
            return {
                name: track.track.name,
                artist: track.track.artists[0].name
            };
        });

        console.log(tracks);

        // Add tracks to youtube playlist
        await addTracksToYoutubePlaylist(tracks);
    });

    function addTracksToYoutubePlaylist(tracks) {
        // Create youtube playlist
        createYoutubePlaylist(playlistName, localStorage.getItem('youtube_accessToken')).then(async (data) => {
            console.log(data);
            var youtubePlaylist = data;
            
            for (const track of tracks) {
                try {
                    if (!track.name) {
                        continue;
                    }
                    if (track.artist === 'null' || track.artist === undefined) {
                        track.artist = '';
                    }
                    const searchResponse = await searchYoutubeMusic(track, localStorage.getItem('youtube_accessToken'));
                    if (searchResponse.length === 0) {
                        console.log('No music found');
                        continue;
                    }
        
                    const musicId = searchResponse[0].id.videoId;
                    console.log(musicId);
                    const addResponse = await addMusicToYoutubePlaylist(youtubePlaylist.id, musicId, localStorage.getItem('youtube_accessToken'));
                    console.log(addResponse);
                } catch (error) {
                    console.error('Error adding music to playlist', error);
                }
            }
        }).catch((error) => {
            if (error.response.status === 401) {
                localStorage.removeItem('youtube_accessToken');
                localStorage.removeItem('youtube_tokenType');
                localStorage.removeItem('youtube_expiresIn');
                window.location.href = 'http://localhost:5500/youtube/auth.html';
            }
        });
    }
}