const express = require("express");
const { spotify_interface } = require("./spotify/main");
const { youtube_interface } = require("./youtube/main");
const { validate_and_get_user_object } = require("./utils");
const { formResponse, sendRestResponse } = require("../auth/utils");
const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

/**
 * GET/spotiyou/:appName/playlists?userid;
 * POST/spotiyou/:appName/sync?userid;sync_to_appname
 */

router.get("/:app_name/playlists", async (req, res) => {
  const app_name = req.params.app_name;
  const user_id = req.query.user_id;

  if (!app_name || !user_id) {
    res.status(400).send("Missing app_name or user_id");
    return;
  }

  const current_user = await validate_and_get_user_object(user_id);

  const app_interface = get_app_interface(app_name);
  const playlists = app_interface.list_playlists(current_user.get_token(app_name));
  sendRestResponse(res, 200, formResponse(200, playlists));
});

router.get("/:app_name/user", async (req, res) => {
  const app_name = req.params.app_name;
  const user_id = req.query.user_id;

  if (!app_name || !user_id) {
    res.status(400).send("Missing app_name or user_id");
    return;
  }

  const current_user = await validate_and_get_user_object(user_id);

  const app_interface = get_app_interface(app_name);
  const user_profile = await app_interface.get_current_user(current_user.get_token(app_name));
  sendRestResponse(res, 200, formResponse(200, user_profile));
});

router.post("/:app_name/createplaylist", async (req, res) => {
  const app_name = req.params.app_name;
  const user_id = req.query.user_id;
  const playlist_name = req.body.playlist_name;

  if (!app_name || !user_id || !playlist_name) {
    res.status(400).send("Missing app_name, user_id or playlist_name");
    return;
  }

  const current_user = await validate_and_get_user_object(user_id);

  const app_interface = get_app_interface(app_name);
  const playlist = await app_interface.create_playlist(
    current_user.get_app_user_id(app_name),
    playlist_name,
    current_user.get_token(app_name)
  );
  if (!playlist || playlist.id === undefined) {
    res.status(500).send("Failed to create playlist");
    return;
  }
  sendRestResponse(res, 200, formResponse(200, "Playlist created successfully"));
});

router.post("/:app_name/sync", async (req, res) => {
  const app_name = req.params.app_name;
  const user_id = req.query.user_id;
  const sync_to_app_name = req.query.sync_to_app_name;
  const playlist_id = req.body.playlist_id;
  const playlist_name = req.body.playlist_name;

  if (!app_name || !user_id || !sync_to_app_name || !playlist_id || !playlist_name) {
    res.status(400).send("Missing app_name, user_id, sync_to_app_name or playlist_id");
    return;
  }

  const current_user = await validate_and_get_user_object(user_id);

  const app_interface = get_app_interface(app_name);
  const sync_playlist = await app_interface.sync_playlist(
    current_user.get_token(app_name),
    playlist_id,
    playlist_name,
    current_user.get_token(sync_to_app_name)
  );
  sendRestResponse(res, 200, formResponse(200, sync_playlist));
});

function get_app_interface(app_name) {
  switch (app_name) {
    case "spotify":
      return spotify_interface;
    case "youtube":
      return youtube_interface;
    default:
      return null;
  }
}

module.exports = router;