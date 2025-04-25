const url = require("url");
const youtube_auth = require("./youtube_auth.js");
const spotify_auth = require("./spotify_auth.js");
const {
  YOUTUBE_API_SCOPE,
  SPOTIFY_API_SCOPE,
  STATUS_OK,
} = require("./const.js");

const express = require("express");
const { formResponse, sendRestResponse } = require("./utils.js");
const router = express.Router();
router.use(express.json());
/**
 * :userID needs to be introduced
 */

/**
 * Youtube Authentication
 */
router.get("/google/callback", async (req, res) => {
  const qs = new url.URL(req.url, "http://localhost:5500/auth/youtube/callback")
    .searchParams;
  const code = qs.get("code");
  const { access_token, expiry_time, refresh_token } =
    await youtube_auth.fetch_access_token(code);

  if (!code) {
    return res.status(400).send("No code provided");
  }
  console.log("Authentication Completed");
  console.log("Access Token " + access_token);
  // TODO: @abinash.r need to store the auth code via mysql
  // oauth2Client will contain expiry_date, access_token, refresh_token
  // youtube_auth.encrypt_store_auth(access_token, expiry_date, refresh_token)
  sendRestResponse(
    res,
    STATUS_OK,
    formResponse(STATUS_OK, "Authentication Completed")
  );
});

router.post("/youtube", async (req, res) => {
  console.log("Youtube Authentication Initiated");
  console.log("Scope :: ", YOUTUBE_API_SCOPE);
  const response = await youtube_auth.authenticate([YOUTUBE_API_SCOPE]);
  sendRestResponse(res, STATUS_OK, response);
});

/**
 * Spotify Authentication
 */
router.post("/spotify", async (req, res) => {
  console.log("Spotify Authentication Initiated");
  console.log("Scope :: ", SPOTIFY_API_SCOPE);
  const response = await spotify_auth.authenticate([SPOTIFY_API_SCOPE]);
  sendRestResponse(res, STATUS_OK, response);
});

router.get("/spotify/callback", async (req, res) => {
  const qs = new url.URL(req.url, "http://localhost:5500/auth/spotify/callback")
    .searchParams;
  const code = qs.get("code");
  const { access_token, expiry_time, refresh_token } =
    await spotify_auth.fetch_access_token(code);

  console.log("Authentication Completed");
  console.log("Access Token " + access_token);
  // TODO: @abinash.r need to store the auth code via mysql
  // spotify_auth.encrypt_store_auth(auth_token, expiry_time, refresh_token)
  sendRestResponse(
    res,
    STATUS_OK,
    formResponse(STATUS_OK, "Authentication Completed")
  );
});

module.exports = router;