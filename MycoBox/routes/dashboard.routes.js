/**
 * Dashboard Routes
 */
const router = require('express').Router()
const { set_environment_state, read_environment_state } = require('../controllers/sensors.controller/sensors.controller')


/** 
 * Dashboard: read Current Environment Model
*/
router.get(`/sensors_controller/read_environment_state`, async (req, res) => {
        console.log('MycoBox Here....')
        await set_environment_state()
        const envmodel = await read_environment_state()
        console.log(`Below is the envmode`)
        console.log(envmodel)
        res.json(envmodel)
})

module.exports = router