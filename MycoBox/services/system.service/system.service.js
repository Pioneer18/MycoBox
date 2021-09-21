/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const { temp_pid_controller_config, update_temperature } = require("../../controllers/environment.manager/temperature.controller");
const { humidity_pid_controller_config, update_humidity, send_command } = require("../../controllers/environment.manager/humidity.controller");
const { get } = require("../../globals/globals")
const { update_environment_state, read_environment_state } = require("../../controllers/sensors.controller/sensors.controller");
const { s5r2_on } = require("../../cli_control_panel/relay");


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
                    .then(() => {
                        // if there is any data returned do whatever with it here
                        // otherwise recall environment_manager, because the session must still be active
                        console.log('#######################')
                        console.log('Recalling ENV MANAGER')
                        console.log('#######################')

                        setTimeout(() => {
                            return environment_manager();
                        }, 1000);
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


/**
 * Validate the current environment state, the calculate the measured and call each controller with its
 * respective configuration object
 * @param {*} env_state 
 * @returns { temp, humidity, co2 }  
 */
const run_pid_controllers = () => {
    console.log('Running PID Controllers')
    return new Promise((resolve) => {
        validate_env_state()
            .then(validation => {
                if (validation.validation) {
                    const measured = map_measured(validation.env_state);
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
                                .then(
                                    update_humidity(humidity_config)
                                        .then(send_command("H 300")
                                            .then(() => {
                                                s5r2_on()
                                                console.log("=======================================")
                                                console.log("Returned Humidity Value: ")
                                                console.log("=======================================")
                                                resolve()
                                            })
                                        )

                                )
                            // update_ventilation - co2 reading (temp and humidity are considered)
                            // update_circulation configuration selected state, not a pid
                        })
                }
            })

    })
}

/**
 * Validate Env State before calculating measured values
 * @param {*} env_state 
 * @returns 
 */
const validate_env_state = () => {
    console.log('METHOD CALL: validate_env_state')
    // get the latet environment state
    return new Promise((resolve) => {
        update_environment_state()
            .then(() => {
                setTimeout(() => {
                    read_environment_state()
                        .then(env_state => {
                            console.log("Environment State")
                            console.log(env_state);
                            if (env_state.internal_temp_1 == '' ||
                                env_state.internal_temp_2 == '' ||
                                env_state.internal_temp_3 == '' ||
                                env_state.precise_temp_c == '' ||
                                env_state.internal_humidity_1 == '' ||
                                env_state.internal_humidity_2 == '' ||
                                env_state.internal_humidity_3 == ''
                            ) {
                                console.log('Validate Env Recall: Blank Env State')
                                update_environment_state()
                                validate_env_state()
                            }
                            else {
                                return resolve({
                                    validation: true,
                                    env_state: env_state
                                })
                            }
                        })

                }, 5000);
            })

    })
}

/**
 * validate that the session is still active
 * @returns true or false
 */
const validate_active_session = () => {
    return new Promise((resolve) => {
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

const map_measured = (env_state) => {
    console.log("METHOD CALL: map_measured")
    console.log(env_state)
    return {
        temperature: env_state.internal_temp_c,
        humidity: env_state.internal_humidity,
        co2: 500 // Debug the co2 meter so this isn't hardcoded
    }
}

module.exports = {
    environment_manager
}