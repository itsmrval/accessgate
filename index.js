const { default: axios } = require("axios");
const express = require("express");
const app = express();
const session = require('express-session');
const databaseService = require('./services/database.service');

databaseService.sync().then(() => {
    console.log("Database ready");
})


require('dotenv').config()

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
);

app.set('trust proxy', 1)
app.set('view engine', 'ejs');
app.use('/static', express.static('public'));

app.get("/", (req, res) => {
    if (req.session.loggedin === true) {
        res.render('index', { user: req.session.user })
    } else {
        res.redirect("/login")
    }
});

app.get("/login", (req, res) => {
    res.render('login')
});

app.get("/keys", (req, res) => {
    res.render('keys')
});

var auth_route = require('./routes/auth.route');

app.use('/auth/', auth_route);

app.listen(8080, () => {
    console.log("running");
})