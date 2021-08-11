/**
 * API Routes
 */
const router = require('express').Router()

/** 
 * Dashboard: New Session
*/
router.post(`/system_controller/start_session`, async (req, res) => {
    try {
        console.log("/system_controller/start_session")
        console.log(req.body)
        res.json("/system_controller/start_session")
    } catch (err) {
        console.log(`Error: ${err}`)
    }
})

/** 
 * Dashboard: read Current Environment Model
*/
router.get(`/sensors_controller/read_environment_model`, async (req, res) => {
    try {
        console.log('/sensors_controller/read_environment_model')
        res.json('Read the Environment Model')

    } catch (err) {
        console.log(`Error: ${err}`)
    }
})

module.exports = router