const axios = require('axios');

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

// Get user playlist
async function getCurrentUserPlaylists() {
  const res = await axios.get(`${YOUTUBE_API}/playlists`, {
    params: {
      part: 'snippet',
      mine: true
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('youtube_accessToken')}`
    }
  });
  return res.data.items;
}

// Get playlist items
async function getPlaylistItems(playlistId) {
  const res = await axios.get(`${YOUTUBE_API}/playlistItems`, {
    params: {
      part: 'snippet',
      playlistId: playlistId
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('youtube_accessToken')}`
    }
  });
  return res.data.items;
}

// Create playlist
async function createPlaylist(title) {
  const res = await axios.post(`${YOUTUBE_API}/playlists`, {
    snippet: {
      title: title,
      description: 'Created with Spofiyou'
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('youtube_accessToken')}`
    }
  });
  return res.data;
}

// Add music to playlist
async function addMusicToPlaylist(playlistId, musicId) {
  const res = await axios.post(`${YOUTUBE_API}/playlistItems`, {
    snippet: {
      playlistId: playlistId,
      resourceId: {
        kind: 'youtube#video',
        videoId: musicId
      }
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('youtube_accessToken')}`
    }
  });
  return res.data;
}