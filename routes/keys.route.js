const express = require('express');

const keyService = require("../services/keys.service");
const Key = require("../model/key.model");
const url = require("url");

var router = express.Router();

router.get('*', (req, res, next) => {
    if (req.session.loggedin === true) {
        next()
    } else {
        res.redirect('/')
    }
});

router.post("/add", (req, res) => {
    try {
        if (req.body.key_content && req.body.key_name) {
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
                "alert": "⚠️ An error occured, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }

})

router.get("/delete/:key", (req, res) => {
    try {
        keyService.delKey(req.params.key, req.session.user.id).then((result) => {
            res.redirect(url.format({
                pathname:'/keys',
                query: {
                    "alert": "🗑️ Key " + req.params.key + " deleted.",
                    "type": "success"
                }
            }));
        })
    } catch(e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/keys',
            query: {
                "alert": "⚠️ An error occured, ask your admin to check logs.",
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