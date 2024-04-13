const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

// Get user playlist
async function getCurrentYoutubeUserPlaylists(token) {
  const res = await axios.get(`${YOUTUBE_API}/playlists`, {
    params: {
      part: 'snippet',
      mine: true
    }}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  return res.data.items;
}

// Get playlist items
async function getYoutubePlaylistItems(playlistId, token) {
  const res = await axios.get(`${YOUTUBE_API}/playlistItems`, {
    params: {
      part: 'snippet',
      playlistId: playlistId
    }}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  return res.data.items;
}

// Create playlist
async function createYoutubePlaylist(title, token) {
  const res = await axios.post(`${YOUTUBE_API}/playlists`, {
    snippet: {
      title: title,
      description: 'Created with Spofiyou'
    }}, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        part: 'snippet'
      }
    });
  return res.data;
}

// Add music to playlist
async function addMusicToYoutubePlaylist(playlistId, musicId, token) {
  const res = await axios.post(`${YOUTUBE_API}/playlistItems`, {
    snippet: {
      resourceId: {
        kind: 'youtube#video',
        videoId: musicId
      },
      playlistId: playlistId
    }},
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        part: 'snippet'
      }
    });
  return res.data;
}