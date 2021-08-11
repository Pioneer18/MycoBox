var express = require('express');
var router = express.Router();

/**
 * Route HTTP requests to correct controllers
 */


/**
 * Override: set environment model
 */
// router.post(`${api}/sensors_controller/set_environment_model`, function (req, res, next) {
//     set_environment_model()
//     res.send('Environment Model Set')
// })



/**
 * API Routes
 */
const configRouter = require('./configuration.routes.js')
const dashboardRouter = require('./dashboard.routes.js')

router.use('/api_v1', configRouter)
router.use('/api_v1', dashboardRouter)

module.exports = router


/**
 * CP: stop session and redirect to post-process page
 */


/**
 * CP: add hours to the session
 */


/**
 * CP: subtract hours from the session
 */
