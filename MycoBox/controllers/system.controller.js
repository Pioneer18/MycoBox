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
module.exports = {

     /**
     * Steps:
     * - Check the MycoBox 'System Status': If session already running then return error: session already active
     * - check the myco_box environment
     * - call the prepare_environment subroutine to set the Evironment Model to the config
     * @returns return confirmation session started
     */
    
    newSession: () => {
       // Python session
       // communicates to js backend with stdin/stdout pipes to get updates mid session; e.g new env_config
       // this is faster? don't have to start a process everytime i want to reach out to an acutaors functionality, yet on the occasional user input an update config
       // can be communicated via stdin and a response from python script via stdout
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

