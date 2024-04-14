function spotifySiginIn() {
    var spotifyAuthEndpoint = 'https://accounts.spotify.com/authorize';

    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', spotifyAuthEndpoint);

    var state = generateRandomString(16);
    var scope = 'playlist-modify-public playlist-modify-private user-read-private user-read-email';

    var params = {
        client_id: '',
        redirect_uri: 'http://localhost:5500/spotify/authcallback.html',
        response_type: 'code',
        scope: scope,
        state: state
    };

    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}

const generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}