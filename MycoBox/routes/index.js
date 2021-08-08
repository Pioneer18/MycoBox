var express = require('express');
var router = express.Router();
// The Controller Classes need to be instantiated before getting here...
const { newSession } = require('../controllers/system.controller/system.controller');
/**
 * Route HTTP requests to correct controllers
 */

/* Start Process */
router.post('/system_controller/start_process', function (req, res, next) {
    res.send(JSON.stringify(newSession()));
});

/**
 * Stop process and redirect to post-process page
 */


/**
 * Add hours to the process
 */


/**
 * Subtract hours from the process
 */

module.exports = router;
