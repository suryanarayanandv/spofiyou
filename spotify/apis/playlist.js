// Playlist Manipulation apis
const SPOTIFY_API = "https://api.spotify.com/v1";

// Get playlist
const getPlaylist = async (playlistId, token) => {
    const response = await axios.get(`${SPOTIFY_API}/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.items;
}

// Get playlist tracks
const getSpotifyPlaylistTracks = async (playlistId, token) => {
    const response = await axios.get(`${SPOTIFY_API}/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.items;
}

// Add tracks to playlist
/**
 * 
 * @param {int} playlistId 
 * @param {int []} tracks 
 * @param {string} token 
 * @returns string
 */
const addMusicToSpotifyPlaylist = async (playlistId, tracks, token) => {
    const response = await axios.post(`${SPOTIFY_API}/playlists/${playlistId}/tracks`, {
        uris: tracks
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
}


// Get user's playlists
const getUserPlaylists = async (userId, token) => {
    const response = await axios.get(`${SPOTIFY_API}/users/${userId}/playlists`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.items;
}

const createSpotifyPlaylist = async (userId, name, token) => {
    const response = await axios.post(`${SPOTIFY_API}/users/${userId}/playlists`, {
        name: name,
        description: "Created by Spotify API",
        public: false
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
}

const getCurrentUserPlaylists = async (token) => {
    const response = await axios.get(`${SPOTIFY_API}/me/playlists`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.items;
}