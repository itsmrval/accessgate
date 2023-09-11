const express = require('express');



var router = express.Router();

router.use('/update/', require('../routes/endpoint/update.route'));

module.exports = router;