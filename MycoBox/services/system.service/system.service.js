/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */

const { response } = require("express");
const { get } = require("../../globals/globals")

/**
 * Responsibilities: 
 * i. coordinates through three session stages
 * ii. maintain PID states
 * iii. call each EM PID
 * process:
 * 2) get the environment_config (setpoints)
 * 3) calculate measured from environment_state
 * 4) pass the setpoints and measured to each PID
 */
const environment_manager = async () => {
    // get the env config and state
    const { env_config, env_state } = await get_config_state();
    console.log('env_config from within environment manager: ');
    console.log(env_config)
    console.log('env_state from within environment manager: ');
    console.log(env_state)
    console.log("Calling Calculate Measured");
    await calculate_measured(env_state);
    return
    // maintain state for PIDs
    // calculate measured
    // call PIDs with config for current session_state (config, measured)

}

const get_config_state = async () => {
    return {
        env_config: await get('environment_config'),
        env_state: await get('environment_state')
    }
}

const calculate_measured = async (env_state) => {
    const validated_env_state = await validate_env_state(env_state);
    console.log(validated_env_state)
    return;
}

const validate_env_state = async (env_state) => {
    if (!env_state.timestamp) throw new Error('missing a timestamp for the environment state')
    if (env_state.timestamp = 'initial') {
        console.log('The initial environment_state has not been set; recalling env_state in 4 seconds');
        let response;
        response = await recall(response)
        await validate_env_state;
    }
    if (env_state.internal_temp_1 || env_state.internal_temp_2 === '' || env_state.internal_temp_3 === '' ||
        env_state.internal_humidity_1 === '' || env_state.internal_humidity_2 === '' || env_state.internal_humidity_3 === '' ||
        env_state.precise_temp_c === '' || env_state.precise_temp_f === '' || env_state.external_temp === '' ||
        env_state.external_humidity === ''
    ) {
        console.log('The initial environment_state has not been set; recalling env_state in 4 seconds');
        let response;
        setTimeout(async () => {
            response = await get('environment_state')
        }, 4000);
        await validate_env_state(response)
    }
    return env_state;
}

const recall = async (response) => {
    setTimeout(async () => { response = await get('environment_state') }, 4000);
    return response
}

module.exports = {
    environment_manager
}