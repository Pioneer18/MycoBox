var express = require('express');
var router = express.Router();
// The Controller Classes need to be instantiated before getting here...
const {SystemController} = require('../controllers/index');
/**
 * Route HTTP requests to correct controllers
 */

/* Start Process */
router.post('/', function(req, res, next) {
//   res.send(JSON.stringify({msg: 'response from mycobox'}));
    res.send(JSON.stringify(new SystemController().startProcess()));
});

module.exports = router;
