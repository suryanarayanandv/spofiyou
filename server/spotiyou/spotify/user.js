const axios = require('axios');
const SPOTIFY_API = "https://api.spotify.com/v1";

// Get current user profile
const getCurrentUserProfile = async (token) => {
  const response = await axios.get(`${SPOTIFY_API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = response.data;
  return {
    id: user.id,
    name: user.display_name,
    email: user.email,
    country: user.country,
    profile_image: user.images[0] ? user.images[0].url : null,
  };
};

module.exports = {
  getCurrentUserProfile,
};
