const axios = require("axios");
const SPOTIFY_API = "https://api.spotify.com/v1";

// Search for a track
const searchSpotifyTrack = async (query, token) => {
  const response = await axios.get(
    `${SPOTIFY_API}/search?q=${query.name}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const spotify_response = response.data.tracks.items[0];
  if (!spotify_response) {
    return {};
  }
  return spotify_response.uri;
};

const searchTrackWithArtist = async (query, token) => {
  const response = await axios.get(
    `${SPOTIFY_API}/search?q=${query.name + " " + query.artist}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let allResponses = response.data.tracks.items;
  let result = [];

  for (let i = 0; i < allResponses.length; i++) {
    let artists = allResponses[i].artists;
    let artistNames = artists.map((artist) => artist.name);
    let trackName = allResponses[i].name;
    let trackInfo = {
      name: trackName,
      artists: artistNames,
    };
    result.push(trackInfo);
  }
  return result;
};

module.exports = {
  searchSpotifyTrack,
  searchTrackWithArtist,
};
