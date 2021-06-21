var express = require('express');
var router = express.Router();
// The Controller Classes need to be instantiated before getting here...
import {startProcess} from '../controllers/system.controller';
/**
 * Route HTTP requests to correct controllers
 */

/* Start Process */
router.post('/', function(req, res, next) {
    res.send(JSON.stringify(startProcess()));
    res.send('Should Have recieved a JSON');
});

module.exports = router;
