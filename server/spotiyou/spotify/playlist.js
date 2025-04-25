// Playlist Manipulation apis
const SPOTIFY_API = "https://api.spotify.com/v1";
const axios = require("axios");
const { handleError, sendRestResponse } = require("../../auth/utils");
const { searchYoutubeMusic } = require("../youtube/search");
const { createYoutubePlaylist, addMusicToYoutubePlaylistInBatches } = require("../youtube/playlist");

// Get playlist
const getPlaylist = async (playlistId, token) => {
  const response = await axios.get(`${SPOTIFY_API}/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const spotify_res = response.data;
  const playlist = {
    id: spotify_res.id,
    title: spotify_res.name,
    description: spotify_res.description,
    thumbnail: spotify_res.images[0]?.url || "",
  };
  return playlist;
};

// Get playlist tracks
const getSpotifyPlaylistTracks = async (playlistId, token) => {
  const response = await axios.get(
    `${SPOTIFY_API}/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const spotify_response = response.data.items;
  const tracks = spotify_response.map((track) => {
    return {
      id: track.track.id,
      name: track.track.name,
      artist: track.track.artists[0].name,
      album: track.track.album.name,
      thumbnail: track.track.album.images[0]?.url || "",
    };
  });
  return tracks;
};

// Add tracks to playlist
/**
 *
 * @param {int} playlistId
 * @param {int []} tracks
 * @param {string} token
 * @returns string
 */
const addMusicToSpotifyPlaylist = async (playlistId, tracks, token) => {
  const response = await axios.post(
    `${SPOTIFY_API}/playlists/${playlistId}/tracks`,
    {
      uris: tracks,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// Get user's playlists
const getUserPlaylists = async (userId, token) => {
  const response = await axios.get(`${SPOTIFY_API}/users/${userId}/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const spotify_response = response.data.items;
  const playlists = spotify_response.map((playlist) => {
    return {
      id: playlist.id,
      title: playlist.name,
      description: playlist.description,
      thumbnail: playlist.images[0]?.url || "",
    };
  });
  return playlists;
}

const createSpotifyPlaylist = async (userId, name, token) => {
  let response = {};
  try {
    response = await axios.post(
      `${SPOTIFY_API}/users/${userId}/playlists`,
      {
        name: name,
        description: "Created by Spotify API",
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error creating playlist:", error.response.data);
    response.error = error;
    return handleError(response, error);
  }

  return response.data;
}

const getCurrentUserPlaylists = async (token) => {
  let response = {};

  try {
    response = await axios.get(`${SPOTIFY_API}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch(error) {
    console.error("Error fetching playlists:", error.response.data);
    response.error = error;
    return handleError(response, error);
  }

  const spotify_response = response.data.items;
  const playlists = spotify_response.map((playlist) => {
    return {
      id: playlist.id,
      title: playlist.name,
      description: playlist.description,
      thumbnail: playlist.images[0]?.url || "",
    };
  });
  return playlists;
}

const syncSpotifyPlaylist = async (spotify_token, playlistId, playlistName, youtube_token) => {
  const tracks = await getSpotifyPlaylistTracks(playlistId, spotify_token);

  const youtube_track_ids = [];
  for (const track of tracks) {
    if (!track.name) {
      continue;
    }
    if (track.artist === 'null' || track.artist === undefined) {
        track.artist = '';
    }
    const query = track.name + ' ' + track.artist + 'song';
    const searchResponse = await searchYoutubeMusic(query, youtube_token);
    if (searchResponse === undefined || searchResponse === null || searchResponse.length === 0) {
      console.log("No music found");
      continue;
    }

    const musicId = searchResponse;
    youtube_track_ids.push(musicId);
  }
  const youtube_playlist_id = (await createYoutubePlaylist(null, playlistName, youtube_token)).id;
  if (youtube_playlist_id === null) {
    console.log("Error creating youtube playlist");
    sendRestResponse(res, 500, formResponse(500, "Error creating youtube playlist"));
    return;
  }
  await addMusicToYoutubePlaylistInBatches(youtube_playlist_id, youtube_track_ids, youtube_token);
}

module.exports = {
  getPlaylist,
  getSpotifyPlaylistTracks,
  addMusicToSpotifyPlaylist,
  getUserPlaylists,
  createSpotifyPlaylist,
  getCurrentUserPlaylists,
  syncSpotifyPlaylist
};
