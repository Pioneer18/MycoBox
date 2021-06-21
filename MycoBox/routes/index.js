var express = require('express');
var router = express.Router();
// The Controller Classes need to be instantiated before getting here...
const {SystemController} = require('../controllers/index');
/**
 * Route HTTP requests to correct controllers
 */

/* Start Process */
router.post('/', function(req, res, next) {
    console.log('Calling the System Controller');
    const results = new SystemController()
    res.send();
});

module.exports = router;
