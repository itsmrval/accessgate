const session = require('express-session');
const bodyParser = require('body-parser');
const express = require("express");

const databaseService = require('./services/database.service');

require('dotenv').config()

userService = require("./services/users.service");

const User = require('./model/user.model')
const Key = require('./model/key.model')
const Member = require("./model/member.model");

const app = express();


databaseService.sync().then(() => {
    console.log("Database ready");
})


require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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

app.use(function(req, res, next) {
    if (req.session.loggedin === true) {
        User.findOne({ where: { id: req.session.user.id } }).then((result) => {
            res.locals.session_user = result
            next()
        });
    } else  {
        next()
    }
});

app.get("/", (req, res) => {
    try {
        if (req.session.loggedin === true) {
            var stats = {}
            Key.count({ where: { idOwner: req.session.user.id } }).then((result) => {
                stats["keys"] = result
                Member.count({ where: { userId: req.session.user.id } }).then((result) => {
                    stats["groups"] = result

                    res.render('index', { user: req.session.user, stats: stats })
                })
            })

        } else {
            res.redirect("/login")
        }
    } catch (e) {
        console.log(e)
    }
});


app.get("/login", (req, res) => {
    res.render('login')
});

userService.makeAdmin("itsmrval")

app.use('/admin/', require('./routes/admin.route'));
app.use('/auth/', require('./routes/auth.route'));
app.use('/keys/', require('./routes/keys.route'));
app.use('/endpoint', require('./routes/endpoint.route'))

app.listen(8080, () => {
    console.log("running");
})