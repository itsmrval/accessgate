const express = require('express');
const User = require("../model/user.model")
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

router.use('/users/', require('../routes/admin/users.route'));
router.use('/members/', require('../routes/admin/members.route'));
router.use('/groups/', require('../routes/admin/groups.route'));
router.use('/servers/', require('../routes/admin/servers.route'));

module.exports = router;