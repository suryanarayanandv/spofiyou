// Get current user profile
const getCurrentUserProfile = async (token) => {
    const response = await axios.get(`${SPOTIFY_API}/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
}