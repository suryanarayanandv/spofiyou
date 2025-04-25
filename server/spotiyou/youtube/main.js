const {
  createYoutubePlaylist,
  getCurrentYoutubeUserPlaylists,
  addMusicToYoutubePlaylistInBatches,
  getYoutubePlaylistItems,
  syncYoutubePlaylist
} = require("./playlist");
const { searchYoutubeMusic } = require("../youtube/search");

const youtube_interface = {
  create_playlist: createYoutubePlaylist,
  list_playlists: getCurrentYoutubeUserPlaylists,
  add_playlist_track: addMusicToYoutubePlaylistInBatches,
  get_playlist_tracsk: getYoutubePlaylistItems,
  search_track: searchYoutubeMusic,
  get_current_user: undefined,
  sync_playlist: syncYoutubePlaylist,
};

module.exports = {
  youtube_interface,
};
