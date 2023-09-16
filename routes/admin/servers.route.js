const express = require('express');
const User = require("../../model/user.model");
const Group = require("../../model/group.model");
const Server = require("../../model/server.model");
const url = require('url');
require('dotenv').config()

memberService = require("../../services/members.service");
serverService = require("../../services/server.service");
var router = express.Router();

const regexp_ip = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/
const regex_space = /^\S*$/;

router.get("/", (req, res) => {
    try {
        // pas très propre à edit
        var lastPullList = {}
        Server.findAll().then((servers) => {
            var secret_display = null
            servers.forEach((server) => {
                if (server.lastPull != null) {
                    lastPullList[server.hostname] = server.lastPull.toLocaleString()
                } else {
                    lastPullList[server.hostname] = 'never'
                }
                if (req.query.alert === "secretDisplay") {
                    var tmp = ''
                    secret_display = {}
                        if (server.hostname === req.query.server) {
                            secret_display.content = server.tmp
                            secret_display.url = process.env.APP_URL
                            secret_display.name = server.hostname,
                            secret_display.user = server.username

                        }
                    }
            })
            res.render('admin/servers', { "servers": servers, "lastPullList": lastPullList, locals: {secret: secret_display, alert: req.query.alert, alert_type: req.query.type} })
        });
    } catch (e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/admin/users',
            query: {
                "alert": "⚠️ An error occured, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }
})


router.post("/add", (req, res) => {
    try {
        if (req.body.server_hostname && req.body.server_ip && req.body.server_multi && req.body.server_username && regexp_ip.test(req.body.server_ip) && regex_space.test(req.body.server_hostname, req.body.server_username)) {
            if (req.body.server_multi === 'true') {
                req.body.server_username = "accessGateMultiuser"
            }
            serverService.addServer(req.body.server_hostname, req.body.server_ip, req.body.server_username).then((secret) => {
                res.redirect(url.format({
                    pathname:'/admin/servers',
                    query: {
                        "server": req.body.server_hostname,
                        "alert": "secretDisplay"
                    }
                }));
            })
        } else {
            res.redirect(url.format({
                pathname:'/admin/servers',
                query: {
                    "alert": "⚠️ Please check the value of your fields or if the server does not already exist.",
                    "type": "danger"
                }
            }));
        }
    } catch (e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/admin/servers',
            query: {
                "alert": "⚠️ An error occured, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }
})

router.get("/delete/:server", (req, res) => {
    try {
        serverService.delServer(req.params.server).then((result) => {
            res.redirect(url.format({
                pathname:'/admin/servers',
                query: {
                    "alert": "✅ Server " + req.params.server + " deleted.",
                    "type": "success"
                }
            }));
        })
    } catch (e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/admin/servers',
            query: {
                "alert": "⚠️ An error occured, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }

});


router.get("/new", async (req, res) => {
    res.render('admin/server_new')
})




module.exports = router;