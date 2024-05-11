require("dotenv").config({path: "./.env"});
var request = require("request");
const app = require("express")();
const port = 3000;


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

    let playlistIDList = []

    for (var i = 0; i < playlistResponse.tracks.items.length; i++) { 
        playlistIDList.push(playlistResponse.tracks.items[i].track.id)
    }

    return playlistIDList
}

function findMatchingObjects(list_1, list_2) {

    let matchingObjects = []

    for (var item_1 = 0; item_1 < list_1.length; item_1++) {

        for (var item_2 = 0; item_2 < list_2.length; item_2++) {
            if (list_1[item_1] == list_2[item_2]) {
                matchingObjects.push(list_1[item_1])
            }
        }

    }

    return matchingObjects

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
    console.log("User 1 Response")

    let userResponse_2 = await userData_2.json();
    console.log("User 2 Response")

    // Get ID'S for all playlists and plug them into their respective lists

    let userTracks_1 = []
    let userTracks_2 = []

    for (var i = 0; i < userResponse_1.items.length; i++) { 
        let Result = await getPlaylistTracks(userResponse_1.items[i].id, access_token);
        for (var trackIndex = 0; trackIndex < Result.length; trackIndex++) {
            userTracks_1.push(Result[trackIndex])
        }
    }

    console.log("Got user 1 tracks")

    for (var i = 0; i < userResponse_2.items.length; i++) { 
        let Result = await getPlaylistTracks(userResponse_2.items[i].id, access_token);
        for (var trackIndex = 0; trackIndex < Result.length; trackIndex++) {
            userTracks_2.push(Result[trackIndex])
        }
    }

    console.log("Got user 2 tracks")

    let matchingObjects = findMatchingObjects(userTracks_1, userTracks_2)

    console.log("You guys are " + matchingObjects.length + "% compatible!");

    return matchingObjects.length;
}

// async function Main() {
//     const access_token = await getAccessToken();
//     const user_1_ID = "ql82ypqt1eu3s898agod9ehqy";
//     const user_2_ID = "ql82ypqt1eu3s898agod9ehqy";

//     const compatabilityLength = getUserInfo(user_1_ID, user_2_ID, access_token);
// }

app.get('/compatibility/:userID1/:userID2', async (req, res) => {
    try {

        const access_token = await getAccessToken()
        const user_1_ID = req.params.userID1
        const user_2_ID = req.params.userID2

        const compatability = getUserInfo(user_1_ID, user_2_ID, access_token)

        res.send("Compatability: " + compatability);
    } catch (error) {
        res.send("Error getting compatability")
    }
})

app.listen(port, () => {
    console.log("Server is running on port " + port);
})