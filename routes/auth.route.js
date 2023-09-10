const express = require('express');
const {default: axios} = require("axios");
const authService = require("../services/auth.service");

var router = express.Router();


router.get("/login", (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=` + process.env.GITHUB_CLIENT_ID)
})


router.get("/callback", async (req, res) => {
    const access_token = await authService.getToken(req.query.code);
    const user = await authService.fetchUser(access_token);
    if (user) {
        await authService.syncUser(user);
        req.session.access_token = access_token;
        req.session.user = user;
        req.session.loggedin = true;
        res.redirect("/");
    } else {
        res.send("An error occured");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(function() {
        res.redirect('/')
    })
})


module.exports = router;