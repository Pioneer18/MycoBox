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
        console.log("here is the submitted config object:")
        console.log(req.body)
       res.send(JSON.stringify(newSession('tee hee')))
    } catch (err) {
        console.log(`Error: ${err}`)
    }
})

module.exports = router