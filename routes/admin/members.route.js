const express = require('express');

groupService = require("../../services/groups.service");
memberService = require("../../services/members.service");

var router = express.Router();

router.get('/:name/add/:user', (req, res) => {
    try {
        memberService.addMember(req.params.user, req.params.name).then((result) => {
            res.redirect('/admin/groups/' + req.params.name)
        });
    } catch(e) {
        console.log(e)
    }
})

router.get('/:name/delete/:user', (req, res) => {
    try {
        memberService.delMember(req.params.user, req.params.name).then((result) => {
            res.redirect('/admin/groups/' + req.params.name)
        });
    } catch(e) {
        console.log(e)
    }
})



module.exports = router;