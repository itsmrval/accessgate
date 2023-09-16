const express = require('express');

const keyService = require("../services/keys.service");
const userService = require("../services/users.service");
const Key = require("../model/key.model");
const url = require("url");

var router = express.Router();

const regexp_space = /^\S*$/;


router.get('*', (req, res, next) => {
    if (req.session.loggedin === true) {
        next()
    } else {
        res.redirect('/')
    }
});

router.post("/add", (req, res) => {
    try {
        if (req.body.key_content && req.body.key_name && regexp_space.test(req.body.key_name)) {
            keyService.addKey(req.body.key_content, req.body.key_name, req.session.user.id).then((result) => {
                res.redirect(url.format({
                    pathname:'/keys',
                    query: {
                        "alert": "✅ Key " + req.body.key_name + " added.",
                        "type": "success"
                    }
                }));
            })
        } else {
            res.redirect(url.format({
                pathname:'/keys',
                query: {
                    "alert": "⚠️ Missing or invalid arguments.",
                    "type": "warning"
                }
            }));
        }
    } catch (e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/keys',
            query: {
                "alert": "⚠️ An error occurred, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }

})

router.post("/username", (req, res) => {
    try {
        if (req.body.key_username && regexp_space.test(req.body.key_username)) {
            userService.updateServerUser(req.session.user.login, req.body.key_username).then((result) => {
                res.redirect(url.format({
                    pathname:'/keys',
                    query: {
                        "alert": "✅ Username updated.",
                        "type": "success"
                    }
                }));
            })
        } else {
            res.redirect(url.format({
                pathname:'/keys',
                query: {
                    "alert": "⚠️ Missing or invalid arguments.",
                    "type": "warning"
                }
            }));
        }
    } catch(e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/keys',
            query: {
                "alert": "⚠️ An error occurred, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }
})

router.get("/delete/:key", (req, res) => {
    try {
        if (req.params.key && regexp_space.test(req.params.key)) {
            keyService.delKey(req.params.key, req.session.user.id).then((result) => {
                res.redirect(url.format({
                    pathname:'/keys',
                    query: {
                        "alert": "🗑️ Key " + req.params.key + " deleted.",
                        "type": "success"
                    }
                }));
            })
        }
    } catch(e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/keys',
            query: {
                "alert": "⚠️ An error occurred, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }

});


router.get("/", (req, res) => {
    try {
        Key.findAll({where: {idOwner: req.session.user.id}}).then((keys) => {
            res.render('keys', { "keys": keys, locals: {alert: req.query.alert, alert_type: req.query.type} })
        })
    } catch(e) {
        console.log(e)

    }
});

module.exports = router;