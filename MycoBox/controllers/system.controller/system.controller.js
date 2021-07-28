const { manageEnvironment } = require("../../services/system.service")

/**
 * System Controller
 * ===General=================
 * - New Session: start a new session that will last for a given duration
 * - End Session: end the session and redirect to post session page (go through 'ending process')
 * - Add Hours: add hours to the duration
 * - Subtract Hours: subtract hours from the duration
 * ===Environment================
 * - ManageEnvironment:
 *   - read the current environment config
 *   - uses sensor controller to read the current environment (update environment model)
 *   - if environment does not match config, 
 *     * set Environment Status (ES): 'Updating' (instead of 'Set')
 *     * set the environment with setEnvironment Method, till completed keep ES as 'Updating' // till true is returned
 *     * once the environment is set update the ES to true
 *   - if environment matches the config,
 *     * set timer for 15 seconds and check and repeat
 * 
 * During a session, the manageEnvironment function receives an "updated environment configuration" whenever a user requests to change something in the environment.
 * This implies that Frontend control panel requests to change the environment all update the environment configuration, and then the manageEnvironement function will
 * handle the update; by calling on the appropriate controllers for updating the environment.
 *  
 */
const {sessionConfig} = require('../../globals/globals')
const {set_environment_model} = require("../sensors.controller/sensors.controller")
module.exports = {

     /**
     * Steps:
     * - Check the MycoBox 'System Status': If session already running then return error: session already active
     * - Set the environment model with the sensors.controller
     * - return confirmation when the manageEnvironment method has begun
     */
    newSession: () => {
        // sensors.controller.setEnvironment()
        if(!sessionConfig.active_session) {
            await set_environment_model()
            manageEnvironment()
        }
        else console.log("There is already an active session!")
    },

    endSession: () => {
        return { TODO: 'build this handler' }
    },

    addHoursToSession: () => {
        return { TODO: 'build this handler' }
    },

    subtractHoursFromSession: () => {
        return { TODO: 'build this handler' }
    },
}

