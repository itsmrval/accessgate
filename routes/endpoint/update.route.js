const express = require('express');
var router = express.Router();

const Server = require("../../model/server.model");

const bcrypt = require("bcrypt");

const serverService = require("../../services/server.service");

router.get("/:server/users", async (req, res) => {
    try {
        Server.findOne({ where: { hostname: req.params.server } }).then((server) => {
            if (server) {
                if (bcrypt.compareSync(req.body.secret, server.secret)) {
                    serverService.getServerUsers(req.params.server).then((result) => {

                        var raw = ''
                        for (x in result) {
                            if (result[x]) {
                                raw += result[x].serverUsername + '\n'
                            }

                        }
                        res.send(raw)
                    })
                } else {
                    res.send("invalid request")
                }
            } else {
                res.send("invalid request")
            }
        })
    } catch (e) {
        console.log(e)
    }
});

router.get("/:server/key/:user", async (req, res) => {
    try {
        Server.findOne({ where: { hostname: req.params.server } }).then((server) => {
            if (server) {
                if (bcrypt.compareSync(req.body.secret, server.secret)) {
                    serverService.getServerUserKey(req.params.server, req.params.user).then((result) => {
                        var raw = ''
                        for (x in result) {
                            raw += '# ' + x + '\n' + result[x] + '\n\n'
                        }
                        res.send(raw)
                        server.lastPull = new Date()
                        server.save()

                    })
                } else {
                    res.send("invalid request")
                }
            } else {
                res.send("invalid request")
            }
        })
    } catch (e) {
        console.log(e)
    }
});

router.get("/:server/allkeys", async (req, res) => {
    try {
        Server.findOne({ where: { hostname: req.params.server } }).then((server) => {
            if (server) {
                if (bcrypt.compareSync(req.body.secret, server.secret)) {
                    serverService.getServerKeys(req.params.server).then((result) => {
                        var raw = ''
                        for (x in result) {
                            raw += '# ' + x + '\n' + result[x] + '\n\n'
                        }
                        res.send(raw)
                        server.lastPull = new Date()
                        server.save()

                    })
                } else {
                    res.send("invalid request")
                }
            } else {
                res.send("invalid request")
            }
        })
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;