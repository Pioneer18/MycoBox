var express = require('express');
var router = express.Router();
// The Controller Classes need to be instantiated before getting here...
const {SystemController} = require('../controllers/index');
/**
 * Route HTTP requests to correct controllers
 */

/* Start Process */
router.post('/', function(req, res, next) {
    // const results = new SystemController().startProcess();
    // res.send(JSON.stringify(results));
    res.send('Should Have recieved a JSON');
});

module.exports = router;
