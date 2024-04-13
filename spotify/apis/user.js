const axios = require('axios');
const SPOTIFY_API = "https://api.spotify.com/v1";

// Get current user profile
const getCurrentUserProfile = async (token) => {
    const response = await axios.get(`${SPOTIFY_API}/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
}