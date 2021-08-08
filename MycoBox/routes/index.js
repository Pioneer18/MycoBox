var express = require('express');
var router = express.Router();
// The Controller Classes need to be instantiated before getting here...
const { newSession } = require('../controllers/system.controller/system.controller');
const {read_environment_model} = require('../controllers/sensors.controller/sensors.controller');
const api = "/api_v1";
/**
 * Route HTTP requests to correct controllers
 */

/**
 * Dashboard: sensor data
 */
router.get(api + '/sensors_controller/environment_model', function (req, res, next) {
    res.send(JSON.stringify(read_environment_model()))
})

/* CP: start session */
router.post(api + '/system_controller/start_process', function (req, res, next) {
    res.send(JSON.stringify(newSession()))
});

/**
 * CP: stop session and redirect to post-process page
 */


/**
 * CP: add hours to the session
 */


/**
 * CP: subtract hours from the session
 */

module.exports = router;
