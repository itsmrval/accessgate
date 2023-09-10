const {default: axios} = require("axios");

async function getToken(code) {
    var client_id = process.env.GITHUB_CLIENT_ID
    var client_secret = process.env.GITHUB_CLIENT_SECRET
    const request = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id,
            client_secret,
            code
        })
    });
    const text = await request.text();
    console.log("RESPONSE!!!");
    const params = new URLSearchParams(text);
    return params.get("access_token");
};

async function fetchUser(access_token) {
    console.log('called')
    const { data } = await axios({
        url: 'https://api.github.com/user',
        method: 'get',
        headers: {
            Authorization: `token ${access_token}`,
        },
    });
    return data;
};

module.exports = {
    fetchUser,
    getToken
};