const clientId = '84c78f094170436ba5253e7e5f5ef9fe';
const redirectUri = 'http://localhost:3000/';

let accesToken;

const Spotify = {

    getAccesToken(){

        if(this.accesToken){

            return accesToken;

        }

        // check for acces token match

        const accesTokenMatch = window.location.href.match(/access_token=([^&]*)/);

        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accesTokenMatch && expiresInMatch){

            accesToken = accesTokenMatch[1];

            const expiresIn = Number(expiresInMatch[0]);

           

            //Clear params, to get new acces when token expires

            window.setTimeout(() => accesToken = '', expiresIn * 6000);

            //Line below basically deletes your acces token

            //window.history.pushState('Acces Token', null, '/');

            return accesToken;

        } else {

            //const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

            window.location = accessUrl;

        }

    },

    search(term){

        const accesToken = Spotify.getAccesToken();

        const headers = {

            Authorization: `Bearer ${accesToken}`

        }

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}` , {headers: headers}

        /* instead of {headers: headers}

        {

            headers: {

                Authorization: `Bearer ${accesToken}`

            }

           

        }*/).then(response => {

            return response.json();

        }).then(jsonResponse => {

            if(!jsonResponse.tracks){

                return [];

            }

            return jsonResponse.tracks.items.map(track => ({

                id: track.id,

                name: track.name,

                artist: track.artists[0].name,

                album: track.album.name,

                uri: track.uri

            }))

        });

           

    },

    savePlayList(name, trackURIs){

        if(!name || !trackURIs.length){

            console.log('name and trakcuris not set');

            return;

        }

        const accesToken = Spotify.getAccesToken();

        //Uncomment line below to see acces token in the console

        console.log(`savePlaylist() accesToken - ${accesToken}`);

        const headers = {

            Authorization: `Bearer ${accesToken}`

        }

        let userId;

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers}

        ).then(response => response.json()

        ).then(jsonResponse => {

            userId = jsonResponse.id;

            //Uncomment line below to see user id in the console

            console.log(`savePlaylist() userId - ${userId}`);

            //instead of  return fetch(`https://api.spotify.com/v1/me/users/${userId}/playlists`,

            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,

            {

                headers: headers,

                method: 'POST',

                body: JSON.stringify({name: name})

            }).then(response => response.json()

            ).then(jsonResponse => {

                const playlistId = jsonResponse.id;

                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {

                    headers: headers,

                    method: 'POST',

                    body: JSON.stringify({uris: trackURIs})

                });

            });

        });

    }

}

export default Spotify;




/* let accessToken;

const clientId = '84c78f094170436ba5253e7e5f5ef9fe';

const redirectUri = 'http://localhost:3000/';

const Spotify = {

    getAccessToken() {

        if(accessToken) {

            return accessToken; 
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);

        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {

            accessToken = accessTokenMatch[1];

            const expiresIn = Number(expiresInMatch[0]);
            
            window.setTimeout(() => accessToken = '', expiresIn * 6000);

            window.history.pushState('Access Token', null, '/');

            return accessToken;

        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

            window.location = accessUrl;
        };
    },
   
    search(term) {
            const accessToken = Spotify.getAccessToken;

            const headers = {

                Authorization: `Bearer ${accessToken}`

            }

            return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: headers }

        ).then(response => {

            return response.json();

        }).then(jsonResponse => {

            if(!jsonResponse.tracks) {

                return [];
            }
            return jsonResponse.tracks.items.map(track => ({

                id: track.id,

                name: track.name,
                
                artists: track.artists[0].name,

                album: track.album.name,

                uri: track.uri

                }));
        })
    },

    savePlayList(name, trackUris) {

        if(!name || !trackUris.length) {

            return
        }

        const accessToken = Spotify.getAccessToken();

        const headers = { Authorization: `Bearer ${accessToken}`};

        let userId;

        return fetch('https://api.spotify.com/v1/me', { headers: headers }

        ).then(resonse => resonse.json()

        ).then(jsonResponse => {

            userId = jsonResponse.id;

            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 

            { headers: headers,

              method: 'POST',

              body: JSON.stringify({name: name})}

        )}).then(response => response.json()

        ).then(jsonResponse => {

            const playlistId = jsonResponse.id;

            return fetch(`https://api.spotify.com//v1/users/${userId}/playlists/${playlistId}/tracks`, { 

              headers: headers,

              method: 'POST',

              body: JSON.stringify({ uris: trackUris })

            });
        });
    }

}

export default Spotify;
*/