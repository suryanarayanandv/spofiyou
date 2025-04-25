const { getCurrentUserProfile } = require("./spotify/user");

class User {
  constructor() {
    this.id = null;
    this.token = {};
    this.app_user_id = {};
  }

  get_token(app_name) {
    return this.token[app_name];
  }

  add_token(app_name, token) {
    this.token[app_name] = token;
  }

  get_app_user_id(app_name) {
    return this.app_user_id[app_name];
  }

  add_app_user_id(app_name, app_user_id) {
    this.app_user_id[app_name] = app_user_id;
  }

  get_user_id() {
    return this.id;
  }
}

async function validate_and_get_user_object(user_id) {
  // TODO: @abin db fetch oauth tokens + user existsi validation
  const spotify_token = "";
  const youtube_token = "";
  const spotify_app_user_id = (await getCurrentUserProfile(spotify_token)).id;
  const user = new User();
  user.id = user_id;
  user.add_token("spotify", spotify_token);
  user.add_token("youtube", youtube_token);
  user.add_app_user_id("spotify", spotify_app_user_id);
  return user;
}

module.exports = {
  validate_and_get_user_object,
};