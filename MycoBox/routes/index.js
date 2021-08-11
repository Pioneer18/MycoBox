var express = require('express');
var router = express.Router();
// The Controller Classes need to be instantiated before getting here...
const { read_environment_model, set_environment_model } = require('../controllers/sensors.controller/sensors.controller');
const api = "/api_v1";
/**
 * Route HTTP requests to correct controllers
 */

/**
 * Dashboard: read environment model
 */
router.get(`${api}/sensors_controller/read_environment_model`, async function (req, res, next) {
    try {
        await set_environment_model()
        const envmodel = await read_environment_model()
        res.json(envmodel)
    } catch (err) {
        console.log(err)
    }
})

/**
 * Override: set environment model
 */
router.post(`${api}/sensors_controller/set_environment_model`, function (req, res, next) {
    set_environment_model()
    res.send('Environment Model Set')
})

// /* CP: start session */
// router.post(`${api}/system_controller/start_process`, function (req, res, next) {
//     res.send(JSON.stringify(newSession()))
// });

/**
 * CP: stop session and redirect to post-process page
 */


/**
 * CP: add hours to the session
 */


/**
 * CP: subtract hours from the session
 */


/**
 * API Routes
 */
const configRouter = require('./configuration.routes.js')
const dashboardRouter = require('./dashboard.routes.js')
const router = require('express').Router()

router.use('/', configRouter)
router.use('/', dashboardRouter)

module.exports = router


