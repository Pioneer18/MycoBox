/**
 * Dashboard Routes
 */
const router = require('express').Router()
const { update_environment_state, read_environment_state } = require('../controllers/sensors.controller/sensors.controller')


/** 
 * Dashboard: read Current Environment Model
*/
router.get(`/sensors_controller/read_environment_state`, async (req, res) => {
        read_environment_state()
                .then(env_state => {
                        res.json(env_state)
                });
})

module.exports = router