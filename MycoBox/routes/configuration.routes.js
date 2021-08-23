const { newSession } = require('../controllers/system.controller/system.controller')

/**
 * Configuration Routes
 */
 const router = require('express').Router()

 /** 
 * Configuration: New Session
*/
router.post(`/system_controller/start_session`, async (req, res) => {
    try {
       res.send((newSession(req.body)))
    } catch (err) {
        console.log(`Error: ${err}`)
    }
})

module.exports = router