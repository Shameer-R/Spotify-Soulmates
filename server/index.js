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

async function getUserInfo(userID, access_token) {
    let getUserPlaylistUrl = `https://api.spotify.com/v1/users/${userID}/playlists`;

    let userData = await fetch(getUserPlaylistUrl, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    });

    let userResponse = await userData.json();

    console.log(userResponse);


}

async function Main() {
    const access_token = await getAccessToken();

    getUserInfo("l5x74zkz5jru3g2v6od993am5", access_token);
}

Main();