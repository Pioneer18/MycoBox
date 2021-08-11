/**
 * Configuration Routes
 */
 const router = require('express').Router()

 /** 
 * Configuration: New Session
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

module.exports = router