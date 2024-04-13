// Search for a track
const searchTrack = async (query, token) => {
    const response = await axios.get(`${SPOTIFY_API}/search?q=${query}&type=track`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.tracks.items;
}

const searchTrackWithArtist = async (query, token) => {
    const response = await axios.get(`${SPOTIFY_API}/search?q=${query}&type=track`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    let allResponses = response.data.tracks.items;
    let result = [];

    for (let i = 0; i < allResponses.length; i++) {
        let artists = allResponses[i].artists;
        let artistNames = artists.map(artist => artist.name);
        let trackName = allResponses[i].name;
        let trackInfo = {
            name: trackName,
            artists: artistNames
        }
        result.push(trackInfo);
    }
}