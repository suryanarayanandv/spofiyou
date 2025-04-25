const axios = require('axios');
const { searchSpotifyTrack } = require('../spotify/search');
const { createSpotifyPlaylist, addMusicToSpotifyPlaylist } = require('../spotify/playlist');
const { getCurrentUserProfile } = require('../spotify/user');

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

// Get user playlist
async function getCurrentYoutubeUserPlaylists(token) {
  const res = await axios.get(`${YOUTUBE_API}/playlists`, {
    params: {
      part: 'snippet',
      mine: true
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  const youtube_response =res.data.items;
  const playlists = youtube_response.map((playlist) => {
    return {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      thumbnail: playlist.snippet.thumbnails.default.url
    };
  });

  return playlists;
}

// Get playlist items
async function getYoutubePlaylistItems(playlistId, token) {
  const res = await axios.get(`${YOUTUBE_API}/playlistItems`, {
    params: {
      part: 'snippet',
      playlistId: playlistId
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  const youtube_response = res.data.items;
  const tracks = youtube_response.map((track) => {
    let title = track.snippet.title;
    // replace special characters
    title = title.replace(/[^a-zA-Z0-9 ]/g, '');
    if (title.length > 38) {
      title = title.substring(0, 38);
    }
    return {
      id: track.snippet.resourceId.videoId,
      name: title,
      artist: track.snippet.channelTitle,
      thumbnail: track.snippet.thumbnails.default.url
    };
  });
  return tracks;
}

// Create playlist
async function createYoutubePlaylist(user_id, title, token) {
  let res = {};
  try {
    res = await axios.post(`${YOUTUBE_API}/playlists`, {
      snippet: {
        title: title,
        description: 'Created with Spofiyou'
      },
      status: {
        privacyStatus: 'private'
      }
    }, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        part: 'snippet,status'
      }
    });
  } catch (error) {
    console.error("Error creating playlist:", error.response.data);
    res.error = error;
    return handleError(res, error);
  }
  return res.data;
}

// Add music to playlist
async function addMusicToYoutubePlaylist(playlistId, musicId, token) {
  // turn musicIds to space separated string
  const res = {};
  try {
    await axios.post(`${YOUTUBE_API}/playlistItems`, {
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
  } catch (error) {
    console.error("Error adding music to playlist:", error.response.data);
    res.error = error;
    return handleError(res, error);
  }
  return res.data;
}

async function addMusicToYoutubePlaylistInBatches(playlistId, musicIds, token) {
  for(const musicId of musicIds) {
    try {
      await addMusicToYoutubePlaylist(playlistId, musicId, token);
    } catch (error) {
      console.error('Error adding music to playlist', musicId, error);
    }
  }
}

async function syncYoutubePlaylist(youtube_token, playlistId, playlistName, spotify_token) {
  const tracks = await getYoutubePlaylistItems(playlistId, youtube_token);

  const musicIdList = [];
  for (const track of tracks) {
    try {
      if (!track.name) {
        continue;
      }
      if (track.artist === 'null' || track.artist === undefined) {
          track.artist = '';
      }
      const searchResponse = await searchSpotifyTrack(track.name, spotify_token);
      if (searchResponse === undefined) {
        console.log('No music found');
        continue;
      }
      musicIdList.push(searchResponse);
    } catch (error) {
      console.error('Error adding music to playlist', error);
    }
  }

  if (musicIdList.length === 0) {
    return;
  }

  const spotifyPlaylist = await createSpotifyPlaylist((await getCurrentUserProfile(spotify_token)).id, playlistName, spotify_token);
  await addMusicToSpotifyPlaylist(spotifyPlaylist.id, musicIdList, spotify_token);
}

module.exports = {
  getCurrentYoutubeUserPlaylists,
  getYoutubePlaylistItems,
  createYoutubePlaylist,
  addMusicToYoutubePlaylistInBatches,
  syncYoutubePlaylist
}