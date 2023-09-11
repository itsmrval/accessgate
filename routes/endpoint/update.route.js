const express = require('express');
var router = express.Router();

const Server = require("../../model/server.model");

const bcrypt = require("bcrypt");

const serverService = require("../../services/server.service");


router.get("/:server", async (req, res) => {
    try {
        Server.findOne({ where: { hostname: req.params.server } }).then((server) => {
            if (bcrypt.compareSync(req.body.secret, server.secret)) {
                serverService.getServerKeys(req.params.server).then((result) => {
                    var raw = ''
                    for (x in result) {
                        raw += '# ' + x + '\n' + result[x] + '\n\n'
                    }
                    res.send(raw)
                })
            } else {
                res.send("invalid secret")
            }
        })
    } catch (e) {
        console.log(e)
    }
});


module.exports = router;


