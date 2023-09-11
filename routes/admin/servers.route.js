const express = require('express');
const User = require("../../model/user.model");
const Group = require("../../model/group.model");
const Server = require("../../model/server.model");
const url = require('url');

memberService = require("../../services/members.service");
serverService = require("../../services/server.service");
var router = express.Router();


router.get("/", (req, res) => {
    try {
        Server.findAll().then((servers) => {
            if (req.query.alert) {
                res.render('admin/servers', { "servers": servers, locals: { alert: req.query.alert, alert_type: req.query.type} })
            } else {
                res.render('admin/servers', { "servers": servers })
            }
        });
    } catch (e) {
        console.log(e)
    }
})


router.post("/add", (req, res) => {
    try {
        if (req.body.server_hostname && req.body.server_ip && req.body.server_username) {
            serverService.addServer(req.body.server_hostname, req.body.server_ip, req.body.server_username).then((result) => {

                res.redirect("/admin/servers")
            })
        } else {
            res.redirect(url.format({
                pathname:'/admin/servers',
                query: {
                    "alert": "Please check the value of your fields or if the server does not already exist.",
                    "type": "danger"
                }
            }));
        }
    } catch (e) {
        console.log(e)
    }
})

router.get("/delete/:server", (req, res) => {
    try {
        serverService.delServer(req.params.server).then((result) => {
            res.redirect("/admin/servers")
        })
    } catch (e) {
        console.log(e)
    }

});


router.get("/:name", async (req, res) => {
    try {
        if (req.params.name === "new") {
            res.render('admin/server_new')
        } else {
            console.log('a')
        }
    } catch(e){
        console.log(e)
    }
})




module.exports = router;