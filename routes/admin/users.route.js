const express = require('express');
const User = require("../../model/user.model");
const Group = require("../../model/group.model");
const Key = require("../../model/key.model");
const keyService = require("../../services/keys.service");
groupService = require("../../services/group.service");
memberService = require("../../services/members.service");
userService = require("../../services/users.service");
var router = express.Router();


router.get("/",async (req, res) => {
    try {
        User.findAll().then((users) => {
            res.render('admin/users', { "users": users})
        })
    } catch(e) {
        console.log(e)
    }
})


router.get("/delete/:userId", (req, res) => {
    try {
        userService.delUser(req.params.userId).then((result) => {
            res.redirect("/admin/users")
        })
    } catch(e) {
        console.log(e)
    }

});


router.get("/:id", async (req, res) => {
    try {
        User.findOne({ where: { id: req.params.id } }).then((user) => {
            Key.findAll({where: { "idOwner": user.id}}).then((keys) => {
                res.render('admin/user_edit', { "keys": keys, "user": user})});
        });
    } catch(e) {
        console.log(e)
    }
})

router.get("/:id/deleteKey/:key", (req, res) => {
    try {
        keyService.delKey(req.params.key, req.params.id).then((result) => {
            res.redirect("/admin/users/"+req.params.id)
        })
    } catch (e) {
        console.log(e)
    }
});

router.post("/:id/addKey", (req, res) => {
    try {
        if (req.body.key_content && req.body.key_name) {
            keyService.addKey(req.body.key_content, req.body.key_name, req.params.id).then((result) => {
                res.redirect("/admin/users/"+req.params.id)
            })
        } else {
            res.redirect("/admin/users/"+req.params.id)
        }
    } catch(e) {
        console.log(e)
    }

})

module.exports = router;