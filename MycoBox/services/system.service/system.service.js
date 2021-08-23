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
    console.log("Calling Calculate Measured");
    await calculate_measured(env_state);
    // call PIDs with config for current session_state (config, measured)
    // maintain state for PIDs

}

const get_config_state = async () => {
    return {
        env_config: await get('environment_config'),
        env_state: await get('environment_state')
    }
}

const calculate_measured = async (env_state) => {
    const validated = await validate_env_state(env_state)
    if(validated === true){
        console.log('Now do some other stuff!!!!!')
    }
    return;
}

const validate_env_state = async (env_state) => {
    if (env_state.timestamp === 'Initial') {
        setTimeout(async () => {
            const res = await get('environment_state')
            await calculate_measured(res);
        }, 8000);
    }
    if (env_state.internal_temp_1 === '') {
        setTimeout(async () => {
            const res = await get('environment_state')
            await calculate_measured(res);
        }, 4000);
    }
    if (env_state.internal_temp_1 !== '' && env_state.external_humidity !== '') {
        console.log('Valid Env State!')
        console.log(env_state);
        return true
    }
    return;
}

module.exports = {
    environment_manager
}