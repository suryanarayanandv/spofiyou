window.onload = function() {
    var root = document.getElementById('root');
    // fetch the current URL
    var currentURL = window.location.href;
    if (currentURL.includes('error=')) {
        root.innerHTML = 'Error: ' + currentURL.split('error=')[1].split('&')[0];

        var back = document.createElement('button');
        back.innerHTML = 'Back';
        back.onclick = function() {
            window.location.href = 'https://suryanarayanandv-fom26fh8-8443.zcodeusers.in/SpofiYou/spotify/auth.html';
        }
        root.appendChild(back);
    }
    else 
    {
        if (window.location.search && window.location.search.includes('code')) {
            var params = new URLSearchParams(window.location.search.substring(1));
            var props = Object.fromEntries(params.entries());
        
            localStorage.setItem('spotify_code', props['code']);
            localStorage.setItem('spotify_state', props['state']);
        

            // Getting acces token
            var SPOTIFY_AUTHORIZATION_ENDPOINT = 'https://accounts.spotify.com/api/token';

            var body = {
                grant_type: 'authorization_code',
                code: localStorage.getItem('spotify_code'),
                redirect_uri: 'https://suryanarayanandv-fom26fh8-8443.zcodeusers.in/SpofiYou/spotify/authcallback.html',
            }

            var client_id = 'cf243a9f33d744419f1e0369d1a690b5';
            var client_secret = '2cfc7ae017ac4b66984a9d7bfa9fcfad';
            var res = axios.post(SPOTIFY_AUTHORIZATION_ENDPOINT, body, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (btoa(client_id + ':' + client_secret))
                }
            });

            res.then((response) => {
                localStorage.setItem('spotify_access_token', response.data.access_token);
                localStorage.setItem('spotify_token_type', response.data.token_type);
                localStorage.setItem('spotify_expires_in', response.data.expires_in);
                window.location.href = 'https://suryanarayanandv-fom26fh8-8443.zcodeusers.in/SpofiYou/app/index.html';
            }).catch((error) => {
                window.location.href = 'https://suryanarayanandv-fom26fh8-8443.zcodeusers.in/SpofiYou/spotify/auth.html';
            });
        }
    }
}