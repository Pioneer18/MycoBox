/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const { temp_pid_controller_config, update_temperature } = require("../../controllers/environment.manager/temperature.controller");
const { get } = require("../../globals/globals")
const { initialize_environment_state } = require("../../controllers/sensors.controller/sensors.controller");


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
        .then(() => {
            console.log('Environment Manager Has Validated Session')
            // #2. Process the current session_state, and don't do anything until its done; not sure why it's async

            // #3. calculate measured and generated a pid_config WHEN valid env_state returned
            run_pid_controllers();
        })


    return
}

/**
 * Return the env_config, env_state, and pid_states
 * @returns 
 */
const get_state = () => {
    console.log("Method Call: get_state")
    return {
        env_config: get('environment_config'),
        env_state: get('environment_state'),
        pid_state: get('pid_state'),
        session_state: get('session_state')
    }
}

/**
 * Average the temperature and humidity
 * @param {*} env_state 
 * @returns { temp, humidity, co2 }  
 */
const run_pid_controllers = () => {
    console.log('Running PID Controllers now ------------------------------------------------------------------------')
    const { env_config, pid_state } = get_state();
    validate_env_state()
        .then(validation => {
            console.log('makin bacon panckages ???????')
            if (validation) {
                console.log('$$$$$$$$$$$$ The Environment State Was Validated $$$$$$$$$$$$')
                const measured = calculate_measured(env_state);
                // =========================================================================================================
                // todo: check for session stage (sr, pi, fr) 
                // generate config for each controller: add the other controller functions for this
                const config = temp_pid_controller_config(measured, env_config.spawn_running, pid_state.temperature)
                // =========================================================================================================
                console.log('Call Each PID');
                return update_temperature(config)
            }
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

        get('environment_state')
            .then(env_state => {
                console.log("METHOD CALL: validate_env_state")
                console.log(env_state)
                if (env_state.internal_temp_1 === '') {
                    console.log('Validate Env Recall: Blank Env State')
                    initialize_environment_state()
                        .then(() => {
                            setTimeout(() => {
                                validate_env_state()
                            }, 8000);
                        })
                }
                if (env_state.internal_temp_1 !== '' && env_state.external_humidity !== '') {
                    console.log('Valid Env State!')
                    console.log(env_state);
                    console.log('Should be resolving true now')
                    return true
                }
            })
            .then(resolve())

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
                if (session_state.active_session) resolve()
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
        temperature: ((parseFloat(env_state.internal_temp_1)) + (parseFloat(env_state.internal_temp_2)) + (parseFloat(env_state.precise_temp_c))) / 3,
        humidity: ((parseFloat(env_state.internal_humidity_1)) + (parseFloat(env_state.internal_humidity_2))) / 2,
        co2: 500 // Debug the co2 meter so this isn't hardcoded
    }
}

module.exports = {
    environment_manager
}