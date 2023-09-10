const express = require('express');
const keyService = require("../services/keys.service");
const Key = require("../model/key.model");

var router = express.Router();

router.get('*', (req, res, next) => {
    if (req.session.loggedin === true) {
        next()
    } else {
        res.redirect('/')
    }
});

router.post("/add", (req, res) => {
    if (req.body.key_content && req.body.key_name) {
        keyService.addKey(req.body.key_content, req.body.key_name, req.session.user.id).then((result) => {
            res.redirect("/keys")
        })
    } else {
        res.redirect("/keys")
    }

})

router.get("/delete/:key", (req, res) => {
    keyService.delKey(req.params.key, req.session.user.id).then((result) => {
        res.redirect("/keys")
    })

});


router.get("/", (req, res) => {
    Key.findAll({where: {idOwner: req.session.user.id}}).then((keys) => {
        res.render('keys', { "keys": keys })
    })
});

module.exports = router;