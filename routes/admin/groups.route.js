const express = require('express');
const User = require("../../model/user.model");
const Group = require("../../model/group.model");
groupService = require("../../services/group.service");
memberService = require("../../services/members.service");
var router = express.Router();


router.get("/", (req, res) => {
    try {
        groupService.getGroupsWithMembers().then((groups) => {
            res.render('admin/groups', { "groups": groups })
        })
    } catch (e) {
        console.log(e)
    }
})


router.post("/add", (req, res) => {
    if (req.body.group_name) {
        groupService.addGroup(req.body.group_name).then((result) => {
            res.redirect("/admin/groups")
        })
    } else {
        res.redirect("/admin/groups")
    }
})

router.get("/delete/:group", (req, res) => {
    try {
        groupService.delGroup(req.params.group).then((result) => {
            res.redirect("/admin/groups")
        })
    } catch (e) {
        console.log(e)
    }

});


router.get("/:name", async (req, res) => {
    try {
        if (req.params.name === "new") {
            res.render('admin/group_new')
        } else {
            Group.findOne({ where: { name: req.params.name } }).then((group) => {
                groupService.groupUserList(req.params.name).then((result) => {
                    User.findAll().then((users) => {
                        for (user in users) {
                            if (JSON.stringify(result).includes(users[user].dataValues.id)) {
                                delete users[user]
                            }
                        }
                        res.render('admin/group_edit', { "group": group, "inGroup": result, "outGroup": users })
                    });
                })
            });
        }
    } catch(e){
        console.log(e)
    }
})




module.exports = router;