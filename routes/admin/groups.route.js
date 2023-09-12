const express = require('express');

const User = require("../../model/user.model");
const Group = require("../../model/group.model");
const Server = require("../../model/server.model");
const {groupServerList} = require("../../services/groups.service");
const url = require("url");

groupService = require("../../services/groups.service");
memberService = require("../../services/members.service");

var router = express.Router();

router.get("/", (req, res) => {
    try {
        groupService.getGroupsWithMembers().then((groups) => {
            groupService.getGroupsWithServers().then((groups2) => {
                for (x in groups) {
                    groups[x]['servers'] = groups2[x].dataValues.accesses
                }
                res.render('admin/groups', { "groups": groups, locals: {alert: req.query.alert, alert_type: req.query.type} })
            })
        })
    } catch (e) {
        console.log(e)
    }
})


router.post("/add", (req, res) => {
    if (req.body.group_name) {
        groupService.addGroup(req.body.group_name).then((result) => {
            res.redirect(url.format({
                pathname:'/admin/groups',
                query: {
                    "alert": "✅ Group " + req.body.group_name + " added.",
                    "type": "success"
                }
            }));
        })
    } else {
        res.redirect(url.format({
            pathname:'/admin/groups',
            query: {
                "alert": "⚠️ Missing or invalid arguments.",
                "type": "warning"
            }
        }));
    }
})

router.get("/delete/:group", (req, res) => {
    try {
        groupService.delGroup(req.params.group).then((result) => {
            res.redirect(url.format({
                pathname:'/admin/groups',
                query: {
                    "alert": "🗑️ Group " + req.params.group + " deleted.",
                    "type": "success"
                }
            }));
        })
    } catch (e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/admin/groups',
            query: {
                "alert": "⚠️ An error occured, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }

});


router.get("/:name", async (req, res) => {
    try {
        if (req.params.name === "new") {
            res.render('admin/group_new')
        } else {
            Group.findOne({ where: { name: req.params.name } }).then((group) => {
                if (group) {
                    groupService.groupUserList(req.params.name).then((result) => {
                        User.findAll().then((users) => {
                            for (user in users) {
                                if (Object.keys(result).includes(users[user].dataValues.id.toString())) {
                                    delete users[user]
                                }
                            }
                            groupService.groupServerList(req.params.name).then((result2) => {
                                Server.findAll().then((servers) => {
                                    for (server in servers) {
                                        if (Object.keys(result2).includes(servers[server].dataValues.hostname)) {
                                            delete servers[server]
                                        }
                                    }
                                    res.render('admin/group_edit', { "group": group, "inGroup": result, "outGroup": users, "inServer": result2, "outServer": servers});
                                });
                            });
                        })
                    });
                } else {
                    res.redirect(url.format({
                        pathname:'/admin/groups',
                        query: {
                            "alert": "⚠️ Missing or invalid group.",
                            "type": "warning"
                        }
                    }));
                }
            })
            ;
        }
    } catch(e){
        console.log(e)
        res.redirect(url.format({
            pathname:'/admin/groups',
            query: {
                "alert": "⚠️ An error occured, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }
})




module.exports = router;