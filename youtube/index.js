window.onload = function() {
    var root = document.getElementById('root');
    // fetch the current URL
    var currentURL = window.location.href;
    if (currentURL.includes('error=')) {
        root.innerHTML = 'Error: ' + currentURL.split('error=')[1].split('&')[0];

        var back = document.createElement('button');
        back.innerHTML = 'Back';
        back.onclick = function() {
            window.location.href = 'http://localhost:5500/youtube/auth.html';
        }
        root.appendChild(back);
    }
    else 
    {
        if (window.location.hash) {
            var params = new URLSearchParams(window.location.hash.substring(1));
            var props = Object.fromEntries(params.entries());
        
            //TODO: caching
            localStorage.setItem('youtube_accessToken', props['access_token']);
            localStorage.setItem('youtube_tokenType', props['token_type']);
            localStorage.setItem('youtube_expiresIn', props['expires_in']);
        
            window.location.href = 'http://localhost:5500/app/index.html';
        }
    }
}