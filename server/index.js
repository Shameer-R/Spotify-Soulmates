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
        console.log(playlistResponse.tracks.items[i].track.id);
    }
}

async function getUserInfo(user_1_ID, user_2_ID, access_token) {

    let getUserPlaylistUrl_1 = `https://api.spotify.com/v1/users/${user_1_ID}/playlists`;
    let getUserPlaylistUrl_2 = `https://api.spotify.com/v1/users/${user_2_ID}/playlists`;

    let userData_1 = await fetch(getUserPlaylistUrl_1, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    });

    let userData_2 = await fetch(getUserPlaylistUrl_2, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    });

    let userResponse_1 = await userData_1.json();
    let userResponse_2 = await userData_2.json();

    // Get ID'S for all playlists
    for (var i = 0; i < userResponse_1.items.length; i++) { 
        await getPlaylistTracks(userResponse_1.items[i].id, access_token);
    }

    for (var i = 0; i < userResponse_2.items.length; i++) { 
        await getPlaylistTracks(userResponse_2.items[i].id, access_token);
    }

}

async function Main() {
    const access_token = await getAccessToken();
    const user_1_ID = "l5x74zkz5jru3g2v6od993am5";
    const user_2_ID = "l5x74zkz5jru3g2v6od993am5"

    getUserInfo(user_1_ID, user_2_ID, access_token);
}

Main();