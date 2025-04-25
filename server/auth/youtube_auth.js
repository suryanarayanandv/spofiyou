// Copyright 2012 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");
const destroyer = require("server-destroy");

const { google } = require("googleapis");
const { json } = require("stream/consumers");
const { STATUS_OK } = require("./const");
const { handleError, formResponse } = require("./utils");
const people = google.people("v1");

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials. In this method, we're setting a global reference for all APIs. Any other API you use here, like `google.drive('v3')`, will now use this auth client. You can also override the auth client at the service and method call levels.
 */
// google.options({auth: oauth2Client});

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to `/callback?code=<code>`
 */
async function authenticate(scopes) {
  const oauth2Client = getOAuth2ClientObject();

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
  });
  console.log("Authentication URL:", authorizeUrl);
  return formResponse(STATUS_OK, authorizeUrl);
}

async function fetch_access_token(code) {
  const oauth2Client = getOAuth2ClientObject();

  const tokens = await oauth2Client.getToken(code);
  return {
    access_token: tokens.tokens.access_token,
    expiry_time: tokens.tokens.expiry_date,
    refresh_token: tokens.tokens.refresh_token,
  };
}

async function refresh_access_token(refresh_token) {
  const oauth2Client = getOAuth2ClientObject();
  oauth2Client.setCredentials({
    refresh_token: refresh_token,
  });
  oauth2Client.refreshAccessToken(function (err, tokens) {
    if (err) {
      console.error("Error refreshing access token", err);
      return handleError(err);
    }

    const { access_token, expiry_date } = tokens;
    // Store the new access token
    // TODO: @abinash.r need to store the auth code via mysql - tokens
    console.log("Access token refreshed successfully");
    return formResponse(STATUS_OK, "Access token refreshed successfully");
  });
}

function getOAuth2ClientObject() {
  const keyPath = path.join(__dirname, "oauth2.keys.youtube.json");
  let keys = { redirect_uris: [""] };
  if (!fs.existsSync(keyPath)) {
    console.error("Error: OAuth2 keys file not found");
    return formResponse("OAuth2 keys file not found");
  }
  keys = JSON.parse(fs.readFileSync(keyPath)).web;

  const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
  );

  return oauth2Client;
}

module.exports = {
  authenticate,
  refresh_access_token,
  fetch_access_token,
};
