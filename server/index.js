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

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var token = body.access_token;
        console.log(token);
    } else {
        console.log(response.statusCode);
    }
});