/**
 * Dashboard Routes
 */
const router = require('express').Router()
const {test} = require('../../controllers/dashboard')


/** 
 * Dashboard: read Current Environment Model
*/
router.get(`/sensors_controller/read_environment_model`, async (req, res) => {
    try {
        console.log('/sensors_controller/read_environment_model')
        const bleh = test()
        res.json(bleh)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
})

module.exports = router