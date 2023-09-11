const express = require('express');
const User = require("../model/user.model");
const Group = require("../model/group.model");
groupService = require("../services/group.service");
const Member = require("../model/member.model");
memberService = require("../services/members.service");
var router = express.Router();

router.use('*', (req, res, next) => {
    if (req.session.loggedin === true) {
        User.findOne({ where: { id: req.session.user.id } }).then((result) => {
            if (result.admin === true) {
                next()
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
});


router.get("/users",async (req, res) => {
    User.findAll().then((users) => {
        res.render('admin/users', { "users": users})

    })
})

router.get("/groups", (req, res) => {
    groupService.getGroupsWithMembers().then((groups) => {
        res.render('admin/groups', { "groups": groups })
    })


})



router.post("/groups/add", (req, res) => {
    if (req.body.group_name) {
        groupService.addGroup(req.body.group_name).then((result) => {
            res.redirect("/admin/groups")
        })
    } else {
        res.redirect("/admin/groups")
    }
})

router.get("/groups/delete/:group", (req, res) => {
    groupService.delGroup(req.params.group).then((result) => {

        res.redirect("/admin/groups")
    })

});


router.get("/groups/:name", async (req, res) => {
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
})

router.get('/members/:name/add/:user', (req, res) => {
    memberService.addMember(req.params.user, req.params.name).then((result) => {
        res.redirect('/admin/groups/' + req.params.name)
    });
})

router.get('/members/:name/delete/:user', (req, res) => {
    memberService.delMember(req.params.user, req.params.name).then((result) => {
        res.redirect('/admin/groups/' + req.params.name)
    });
})



module.exports = router;