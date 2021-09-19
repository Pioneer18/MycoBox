/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const { temp_pid_controller_config, update_temperature } = require("../../controllers/environment.manager/temperature.controller");
const { humidity_pid_controller_config, update_humidity, send_command} = require("../../controllers/environment.manager/humidity.controller");
const { get } = require("../../globals/globals")
const { update_environment_state } = require("../../controllers/sensors.controller/sensors.controller");


/**
 * Responsibilities: Calls Promises 
 * i. coordinates through three session stages
 * ii. maintain PID states
 * iii. call each EM PID
 */
const environment_manager = () => {
    console.log('METHOD CALL: environment_manager')
    // #1. Validate the session is still active and THEN
    validate_active_session()
        .then((validation) => {
            console.log('Validation Results: ' + validation)
            // #2. Process the current session_state, and don't do anything until its done; not sure why it's async

            // #3. calculate measured and generated a pid_config WHEN valid env_state returned
            if (validation) {
                console.log('Environment Manager Has Validated Session')
                //update_environment_state()
                    run_pid_controllers()
                        .then(data => {
                            // if there is any data returned do whatever with it here
                            // otherwise recall environment_manager, because the session must still be active
                            console.log('#############################################################################')
                            console.log('Update Value Returned | ' + data + ' | Recalling ENV MANAGER')
                            console.log('#############################################################################')

                            setTimeout(() => {
                                console.log('**************************** Waited 2 Seconds ****************************')
                                return environment_manager();
                            }, 3000);
                        })

            }
            if (!validation) {
                resolve('Session has ended')
            }
        })
}

/**
 * Return the env_config, env_state, and pid_states
 * @returns 
 */
const get_state = () => {
    return Promise.all([get('environment_config'), get('environment_state'), get('pid_state'), get('session_state')]).then(values => values);
}

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
    console.log(values);
});

/**
 * Validate the current environment state, the calculate the measured and call each controller with its
 * respective configuration object
 * @param {*} env_state 
 * @returns { temp, humidity, co2 }  
 */
const run_pid_controllers = () => {
    console.log('Running PID Controllers now ------------------------------------------------------------------------')
    return new Promise((resolve) => {
        update_environment_state()
            .then(()=> validate_env_state()
                .then(validation => {
                    if (validation.validation) {
                        const measured = calculate_measured(validation.env_state);
                        // =========================================================================================================
                        // todo: check for session stage (sr, pi, fr) 
                        // generate config for each controller: add the other controller functions for this
                        get_state()
                            .then(state => {
                                // pass correct stage to the pid controllers to select the correct env_config, different setpoints for each stage!
                                console.log(state)
                                const temp_config = temp_pid_controller_config(measured, state[0].spawn_running, state[2].temperature)
                                const humidity_config = humidity_pid_controller_config(measured, state[0].spawn_running, state[2].humidity)
                                update_temperature(temp_config)
                                update_humidity(humidity_config)
                                // update_ventilation - co2 reading (temp and humidity are considered)
                                // update_circulation configuration selected state, not a pid
                                return
                            })
                            .then(results => resolve(results))
                    }
                }))
        
    })
}

/**
 * Validate Env State before calculating measured values
 * @param {*} env_state 
 * @returns 
 */
const validate_env_state = () => {
    console.log('METHOD CALL: validate_env_state ----------------------–----------------------–----------------------–')
    // get the latet environment state
    return new Promise((resolve) => {
        get('environment_state')
            .then(env_state => {
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
                    update_environment_state()
                        .then(() => {
                            setTimeout(() => {
                                recheck_env_state(resolve)
                            }, 8000);
                        })
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

    })
}

const recheck_env_state = (resolve) => {
    get('environment_state')
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

/**
 * validate that the session is still active
 * @returns true or false
 */
const validate_active_session = () => {
    return new Promise((resolve) => {
        console.log('Validating Active Session *********************************************')
        get('session_state')
            .then(session_state => {
                if (session_state.active_session) resolve(true)
                else {
                    resolve(false)
                }
            })
            .catch(err => console.log('ERROR CAUGHT: validate_active_session: ' + err))
    })
}

/**
 * check the status of the current session_state 'stage' (spawn running, primordia init, fruiting), then calculate and 
 * initiate the correct response; e.g. switch to primordia init and call run_pid_controllers with the configuration for primordia_init
 */
const process_session_state = async (measured) => {
    const session_state = get('session_state');

}

const calculate_measured = (env_state) => {
    console.log("METHOD CALL: calculate_measured")
    return {
        temperature: ((parseFloat(env_state.internal_temp_1)) + (parseFloat(env_state.internal_temp_2)) + (parseFloat(env_state.internal_temp_3)) + (parseFloat(env_state.precise_temp_c))) / 4,
        humidity: ((parseFloat(env_state.internal_humidity_1)) + (parseFloat(env_state.internal_humidity_2)) + (parseFloat(env_state.internal_humidity_3))) / 3,
        co2: 500 // Debug the co2 meter so this isn't hardcoded
    }
}

module.exports = {
    environment_manager
}