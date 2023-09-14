const {default: axios} = require("axios");
const User = require('../model/user.model')
const userService = require("./users.service");

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
    const params = new URLSearchParams(text);
    return params.get("access_token");
};


async function syncUser(user) {
    User.findOne({where: { id: user.id}}).then((result) => {
        if (result) {
            result.login = user.login;
            result.avatar = user.avatar_url;
            result.displayName = user.name;
            result.save().then(() => {
                console.log('user ' + user.login + ' updated in database')
            });
        } else {
            User.findAll().then((users) => {
                User.create({
                    id: user.id,
                    login: user.login,
                    avatar: user.avatar_url,
                    displayName: user.name,
                    admin: (users.length === 0),
                    serverUsername: user.login,

                }).then(() => {
                    console.log('user ' + user.login + ' added to database')
                })
            })
        }
    });
}

async function fetchUser(token) {
    const request = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: "token " + token
        }
    });
    return await request.json();
}

module.exports = {
    fetchUser,
    getToken,
    syncUser
};