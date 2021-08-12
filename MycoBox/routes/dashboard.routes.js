/**
 * Dashboard Routes
 */
const router = require('express').Router()
const { set_environment_model, read_environment_model } = require('../controllers/sensors.controller/sensors.controller')


/** 
 * Dashboard: read Current Environment Model
*/
router.get(`/sensors_controller/read_environment_model`, async (req, res) => {
    try {
        console.log('MycoBox Here....')
        await set_environment_model
        const envmodel = await read_environment_model
        console.log(`Below is the envmode`)
        console.log(envmodel)
        res.json(envmodel)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router