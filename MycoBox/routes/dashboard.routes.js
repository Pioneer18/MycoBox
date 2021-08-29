/**
 * Dashboard Routes
 */
const router = require('express').Router()
const { initialize_environment_state, read_environment_state } = require('../controllers/sensors.controller/sensors.controller')


/** 
 * Dashboard: read Current Environment Model
*/
router.get(`/sensors_controller/read_environment_state`, async (req, res) => {
        initialize_environment_state()
                .then(()=> read_environment_state())
                .then(env_state => {
                        console.log('Router.GET: Environment State ****************************************************')
                        console.log(env_state)
                        res.json(env_state)
                });
})

module.exports = router