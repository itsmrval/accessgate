const express = require('express');
const User = require("../../model/user.model");
const Key = require("../../model/key.model");
const url = require("url");

keyService = require("../../services/keys.service");
groupService = require("../../services/groups.service");
memberService = require("../../services/members.service");
userService = require("../../services/users.service");

var router = express.Router();


router.get("/",async (req, res) => {
    try {
        User.findAll().then((users) => {
            res.render('admin/users', { "users": users, locals: {alert: req.query.alert, alert_type: req.query.type}})
        })
    } catch(e) {
        console.log(e)
    }
})


router.get("/delete/:userId", (req, res) => {
    try {
        if (req.params.userId != req.session.user.id) {
            userService.delUser(req.params.userId).then((result) => {
                res.redirect(url.format({
                    pathname:'/admin/users',
                    query: {
                        "alert": "🗑️ User " + req.params.userId + " deleted.",
                        "type": "success"
                    }
                }));
            })
        } else {
            res.redirect(url.format({
                pathname:'/admin/users',
                query: {
                    "alert": "☹️",
                    "type": "danger"
                }
            }));
        }
    } catch(e) {
        console.log(e)
        res.redirect(url.format({
            pathname:'/admin/users',
            query: {
                "alert": "⚠️ An error occured, ask your admin to check logs.",
                "type": "danger"
            }
        }));
    }

});


router.get("/:id", async (req, res) => {
    try {
        User.findOne({ where: { id: req.params.id } }).then((user) => {
            Key.findAll({where: {"idOwner": user.id}}).then((keys) => {
                res.render('admin/user_edit', {
                    "keys": keys,
                    "user": user,
                    locals: {alert: req.query.alert, alert_type: req.query.type}
                })
            });
        })
    } catch(e) {
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

router.get("/:id/deleteKey/:key", (req, res) => {
    try {
        keyService.delKey(req.params.key, req.params.id).then((result) => {
            res.redirect(url.format({
                pathname:"/admin/users/"+req.params.id,
                query: {
                    "alert": "🗑️ Key " + req.params.key + " deleted.",
                    "type": "success"
                }
            }));
        })
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
});

router.post("/:id/addKey", (req, res) => {
    try {
        if (req.body.key_content && req.body.key_name) {
            keyService.addKey(req.body.key_content, req.body.key_name, req.params.id).then((result) => {
                res.redirect(url.format({
                    pathname:"/admin/users/"+req.params.id,
                    query: {
                        "alert": "✅ Key " + req.body.key_name + " added.",
                        "type": "success"
                    }
                }));
            })
        } else {
            res.redirect(url.format({
                pathname:"/admin/users/"+req.params.id,
                query: {
                    "alert": "⚠️ Missing or invalid arguments.",
                    "type": "warning"
                }
            }));
        }
    } catch(e) {
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

module.exports = router;