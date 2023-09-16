const express = require('express');
groupService = require("../../services/groups.service");
memberService = require("../../services/members.service");
accessesService = require("../../services/accesses.service");

var router = express.Router();


router.get('/:name/add/:server', (req, res) => {
    try {
        accessesService.addAccess(req.params.server, req.params.name).then((result) => {
            res.redirect('/admin/groups/' + req.params.name)
        });
    } catch(e) {
        console.log(e)
    }
})

router.get('/:name/delete/:server', (req, res) => {
    try {
        accessesService.delAccess(req.params.server, req.params.name).then((result) => {
            res.redirect('/admin/groups/' + req.params.name)
        });
    } catch(e) {
        console.log(e)
    }
})



module.exports = router;