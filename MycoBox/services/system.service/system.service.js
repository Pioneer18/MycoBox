/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const { temp_pid_controller_config, update_temperature } = require("../../controllers/environment.manager/temperature.controller");
const { initialize_environment_state } = require("../../controllers/sensors.controller/sensors.controller");
const { get, set_session_state } = require("../../globals/globals")


/**
 * Responsibilities: 
 * i. coordinates through three session stages
 * ii. maintain PID states
 * iii. call each EM PID
 */
const environment_manager = async () => {
    const session_state = get('session_state');
    console.log('Top of the Environment Manager')
    // #1. Validate the session is still active
    const active_session = validate_active_session();
    if (!active_session) return; // create a terminate function, to properly end the session
    // #2. Process the current session_state, and don't do anything until its done; not sure why it's async

    // #3. calculate measured and generated a pid_config WHEN valid env_state returned
    while (active_session) {
        // will stop calling run_pid_controllers while waiting for the actuators etc to update
        if (session_state.restart){
            console.log('Method Call: run_pid_controllers (Generate PID Config)');
            await run_pid_controllers();
        }
    }

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
const run_pid_controllers = async () => {
    const { env_config, env_state, pid_state, session_state } = get_state();
    const validated = await validate_env_state(env_state)
    // validate the run_pid controllers has completed once
    console.log("Method Call: validate_env_state (Block till valid env_state returned) ---------------------------------------------------------------------------")
    if (validated & session_state.restart) {
        set_session_state('restart', false);
        const measured = calculate_measured(env_state);
        console.log('Call Each PID');
        // =========================================================================================================
        const completed = await update_actuators(measured, env_config, pid_state)
        if (completed) {
            console.log('Update Actuators has completed, run_pid_controllers cam run an update again now')
            set_session_state('restart', true);
        }
    }

}

/**
 * Validate Env State before calculating measured values
 * @param {*} env_state 
 * @returns 
 */
const validate_env_state = async (env_state) => {
    if (env_state.timestamp === 'Initial') {
        console.log('Validate Env Recall: Timpestamp === Initial')
        initialize_environment_state();
        setTimeout(async () => {
            await run_pid_controllers();
        }, 8000);
    }
    if (env_state.internal_temp_1 === '') {
        console.log('Validate Env Recall: Blank Env State')
        initialize_environment_state();
        setTimeout(async () => {
            await run_pid_controllers();
        }, 4000);
    }
    if (env_state.internal_temp_1 !== '' && env_state.external_humidity !== '') {
        console.log('Environment State has been validated $$')
        return true
    }
    return;
}

/**
 * validate that the session is still active
 * @returns true or false
 */
const validate_active_session = () => {
    const session_state = get('session_state');
    if (session_state) return true
    return false
}

/**
 * check the status of the current session_state 'stage' (spawn running, primordia init, fruiting), then calculate and 
 * initiate the correct response; e.g. switch to primordia init and call run_pid_controllers with the configuration for primordia_init
 */
const process_session_state = async (measured) => {
    const session_state = get('session_state');

}

/**
 * Generates a config for each controller and runs each controller
 */
const update_actuators = async (measured, env_config, pid_state) => {
    const temp_config = await temp_pid_controller_config(measured, env_config.spawn_running, pid_state.temperature)
    const temp_controller = await update_temperature(temp_config)
    if (temp_controller) return true
}

const calculate_measured = (env_state) => {
    console.log('METHOD CALL: calculate_measured')
    return {
        temperature: ((parseFloat(env_state.internal_temp_1)) + (parseFloat(env_state.internal_temp_2)) + (parseFloat(env_state.precise_temp_c))) / 3,
        humidity: ((parseFloat(env_state.internal_humidity_1)) + (parseFloat(env_state.internal_humidity_2))) / 2,
        co2: 500 // Debug the co2 meter so this isn't hardcoded
    }
}

module.exports = {
    environment_manager
}