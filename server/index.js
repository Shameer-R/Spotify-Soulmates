require("dotenv").config({path: "./.env"});
var request = require("request");


const client_id = process.env.ClientID;
const client_secret = process.env.ClientSecret;

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

function getAccessToken() {
    return new Promise((resolve, reject) => {
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body.access_token);
            } else {
                reject(response.statusCode);
            }
        }); 
    }); 
}

async function getPlaylistTracks(playlistID, access_token) {

    let getTracksUrl = `https://api.spotify.com/v1/playlists/${playlistID}`;

    let playlistData = await fetch(getTracksUrl, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    });

    let playlistResponse = await playlistData.json();

    

    for (var i = 0; i < playlistResponse.tracks.items.length; i++) { 
        console.log(playlistResponse.tracks.items[i].track.name);
    }
}

async function getUserInfo(userID, access_token) {
    let getUserPlaylistUrl = `https://api.spotify.com/v1/users/${userID}/playlists`;

    let userData = await fetch(getUserPlaylistUrl, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    });

    let userResponse = await userData.json();

    // Get ID'S for all playlists
    for (var i = 0; i < userResponse.items.length; i++) { 
        await getPlaylistTracks(userResponse.items[i].id, access_token);
    }

}

async function Main() {
    const access_token = await getAccessToken();

    getUserInfo("l5x74zkz5jru3g2v6od993am5", access_token);
}

Main();