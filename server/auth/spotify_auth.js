const path = require("path");
const fs = require("fs");
const axios = require("axios");
const {
  SPOTIFY_AUTH_ENDPOINT,
  SPOTIFY_TOKEN_ENDPOINT,
  STATUS_OK,
  STATUS_ERROR,
} = require("./const");
const { formResponse } = require("./utils");

async function authenticate(scopes) {
  const keys = getOAuthKeys();

  const state = generateRandomString(16);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: keys.client_id,
    scope: scopes.join(" "),
    redirect_uri: keys.redirect_uris[0],
    state: state,
  });

  const queryString = params.toString();

  const authorize_url = SPOTIFY_AUTH_ENDPOINT + "?" + queryString;
  return formResponse(STATUS_OK, authorize_url);
}

function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

async function fetch_access_token(code) {
  const keyPath = path.join(__dirname, "oauth2.keys.spotify.json");
  let keys = { redirect_uris: [""] };
  if (!fs.existsSync(keyPath)) {
    console.error("Error: OAuth2 keys file not found");
    return formResponse(STATUS_ERROR, "OAuth2 keys file not found");
  }
  keys = JSON.parse(fs.readFileSync(keyPath)).web;

  const body = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: keys.redirect_uris[0],
  };

  let response = await axios.post(SPOTIFY_TOKEN_ENDPOINT, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(keys.client_id + ":" + keys.client_secret),
    },
  });

  const expiry_time = Date.now() + response.data.expires_in * 1000;

  return {
    access_token: response.data.access_token,
    expiry_time: expiry_time,
    refresh_token: response.data.refresh_token,
  };
}

async function refresh_access_token(refresh_token) {
  const url = SPOTIFY_TOKEN_ENDPOINT;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      client_id: clientId,
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();

  const { access_token, expire } = response;
  const expiry_time = Date.now() + expires_in * 1000;
  // Store the new access token
  // TODO: @abinash.r need to store the auth code via mysql - tokens
  console.log("Access token refreshed successfully");
  return formResponse(STATUS_OK, "Access token refreshed successfully");
}

function getOAuthKeys() {
  const keyPath = path.join(__dirname, "oauth2.keys.spotify.json");
  let keys = { redirect_uris: [""] };
  if (!fs.existsSync(keyPath)) {
    console.error("Error: OAuth2 keys file not found");
    return formResponse(STATUS_ERROR, "OAuth2 keys file not found");
  }
  keys = JSON.parse(fs.readFileSync(keyPath)).web;
  return keys;
}

module.exports = {
  authenticate,
  fetch_access_token,
  refresh_access_token,
};
