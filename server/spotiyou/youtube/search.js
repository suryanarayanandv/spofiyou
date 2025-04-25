const axios = require('axios');
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

// Search for a music
async function searchYoutubeMusic(query, token) {
  const res = await axios.get(`${YOUTUBE_API}/search`, {
    params: {
      part: 'snippet',
      q: `${query}`,
      type: 'video',
      maxResults: 10
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const youtube_response = res.data.items[0];
  if (!youtube_response) {
    return {};
  }
  return youtube_response.id.videoId;
}

module.exports = {
  searchYoutubeMusic
}