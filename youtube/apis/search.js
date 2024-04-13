// Search for a music
async function searchYoutubeMusic(query, token) {
  const res = await axios.get(`${YOUTUBE_API}/search`, {
    params: {
      part: 'snippet',
      q: `${query.name} ${query.artist}`,
      type: 'video',
      maxResults: 10
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data.items;
}