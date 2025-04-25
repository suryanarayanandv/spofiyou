const {
  getCurrentUserPlaylists,
  createSpotifyPlaylist,
  addMusicToSpotifyPlaylist,
  getSpotifyPlaylistTracks,
  syncSpotifyPlaylist,
} = require("./playlist");
const { searchSpotifyTrack } = require("./search");
const { getCurrentUserProfile } = require("./user");

const spotify_interface = {
  create_playlist: createSpotifyPlaylist,
  list_playlists: getCurrentUserPlaylists,
  add_playlist_track: addMusicToSpotifyPlaylist,
  get_playlist_track: getSpotifyPlaylistTracks,
  search_track: searchSpotifyTrack,
  get_current_user: getCurrentUserProfile,
  sync_playlist: syncSpotifyPlaylist,
};

module.exports = {
  spotify_interface,
};
