const axios = require('axios');

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

// Search for a music
async function searchMusic(query) {
  const res = await axios.get(`${YOUTUBE_API}/search`, {
    params: {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 10
    },
    headers: {
      Authorization: `Bearer ${process.env.YOUTUBE_ACCESS_TOKEN}`
    }
  });
  return res.data.items;
}