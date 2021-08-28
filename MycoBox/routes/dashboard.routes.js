/**
 * Dashboard Routes
 */
const router = require('express').Router()
const { initialize_environment_state, read_environment_state } = require('../controllers/sensors.controller/sensors.controller')


/** 
 * Dashboard: read Current Environment Model
*/
router.get(`/sensors_controller/read_environment_state`, async (req, res) => {
        await initialize_environment_state()
        const envmodel = await read_environment_state()
        res.json(envmodel)
})

module.exports = router