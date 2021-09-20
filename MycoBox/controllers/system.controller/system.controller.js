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
const { get, set_environment_config, set_session_state } = require('../../globals/globals');
const { environment_manager } = require("../../services/system.service/system.service")
const { update_environment_state, read_environment_state } = require("../sensors.controller/sensors.controller")

/**
 * New Session: A promise to run the Environment Manager after the initial setup
* Steps:
* - check if there is already an active session
* - set the environment configuration
* - Set the environment state with the sensors.controller
* - Start this sessions environment manager; which will run for some long duration
*/

function newSession(config) {
    return new Promise((resolve) => {
        const session_state = get('session_state');
        if (!session_state.active_session) {
            set_environment_config(config)
                .then(update_environment_state()
                    .then(read_environment_state())
                    .then(env_state => validate_env_state(env_state))
                )
                .then(set_session_state('active_session', true))
                .then(environment_manager())
                .then(resolve())
                .catch(err => console.log(`Error Caught: new_session: ${err}`))

        } else {
            throw new Error('There is already an active session')
        }
    });
}

const validate_env_state = (env_state) => {
    console.log("###################### System Controller: Validating Environment State ######################")
    // get the latet environment state
    return new Promise((resolve) => {
        console.log("Environment State: *****************************************")
        console.log(env_state);
        if (typeof env_state.internal_temp_1 !== 'number' ||
            typeof env_state.internal_temp_2 !== 'number' ||
            typeof env_state.internal_temp_3 !== 'number' ||
            typeof env_state.precise_temp_c !== 'number' ||
            typeof env_state.internal_humidity_1 !== 'number' ||
            typeof env_state.internal_humidity_2 !== 'number' ||
            typeof env_state.internal_humidity_3 !== 'number'
        ) {
            console.log('Validate Env Recall: Blank Env State')
            // update_environment_state()
            //     .then(() => {
            //         setTimeout(() => {
            //             recheck_env_state(resolve)
            //         }, 8000);
            //     })
            recheck_env_state(resolve)
        }
        if (typeof env_state.internal_temp_1 === 'number' ||
            typeof env_state.internal_temp_2 === 'number' ||
            typeof env_state.internal_temp_3 === 'number' ||
            typeof env_state.precise_temp_c === 'number' ||
            typeof env_state.internal_humidity_1 === 'number' ||
            typeof env_state.internal_humidity_2 === 'number' ||
            typeof env_state.internal_humidity_3 === 'number') {
            return resolve({
                validation: true,
                env_state: env_state
            })
        }
    })
}

const recheck_env_state = (resolve) => {
    read_environment_state()
        .then(env_state => {
            console.log("Validation Recheck: ************************")
            console.log(env_state)
            if (env_state.internal_temp_1 === '') {
                update_environment_state()
                    .then(() => {
                        setTimeout(() => {
                            recheck_env_state(resolve)
                        }, 8000);
                    })
            }
            if (env_state.internal_temp_1 !== '' && env_state.external_humidity !== '') {
                return resolve({
                    validation: true,
                    env_state: env_state
                })
            }
        })

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

