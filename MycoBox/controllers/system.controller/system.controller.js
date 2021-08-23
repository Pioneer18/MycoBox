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
 *   - pass environment state down to PID controllers, and any configuration update from the control panel
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
const {get, set_environment_config} = require('../../globals/globals');
const { environment_manager } = require("../../services/system.service/system.service")
const { set_environment_state } = require("../sensors.controller/sensors.controller")

    /**
    * Steps:
    * - Check the MycoBox 'System Status': If session already running then return error: session already active
    * - set the environment configuration
    * - Set the environment state with the sensors.controller
    * - Start this sessions environment manager
    */

   const newSession = async (config) => {
       try { // start the new session
        const session_state = await get('session_state');
        if (!session_state.active_session) {
                // console.log(`Starting session ${globals.session_state.session_title} - ${globals.session_state.session_id}`);
                await set_environment_config(config);
                await set_environment_state();
                console.log(get('environment_stat'))
                // await environment_manager();
            } else {
                throw new Error('There is already an active session');
            }
        } catch (err) {
            console.log(`Failed to start a new session - Error: ${err}`); 
        }

    }

    // const endSession = () => {
    //     return { TODO: 'build this handler' }
    // },

    // const addHoursToSession = () => {
    //     return { TODO: 'build this handler' }
    // },

    // const subtractHoursFromSession = () => {
    //     return { TODO: 'build this handler' }
    // },


module.exports = {
    newSession,
}

