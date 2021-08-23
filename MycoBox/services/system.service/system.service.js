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
    // while 'trigger' loops & timers
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

/**
 * 
 * @param {*} env_state 
 * @returns {
 *  temp,
 *  humidity,
 *  co2
 * }  
 */
const calculate_measured = async (env_state) => {
    const validated = await validate_env_state(env_state)
    let measured = { temperature: 1, humidity: 1, co2: 1 }
    if (validated === true) {
        console.log('Now Calculate the measured!!!!!')
        // temperature = t1(.2222) * t2(.2222) * t3(.2222) *pTemp(.3333) / 4
        measured.temperature = ((parseFloat(validated.internal_temp_1) * 0.275) * (parseFloat(validated.internal_temp_2) * 0.275) * (parseFloat(validated.precise_temp_c) * 0.45)) / 3
        // humidity = h1(.2222) * h2(.2222) * h3(.2222) / 3
        measured.humidity = ((parseFloat(validated.internal_humidity_1) * 0.5) * (parseFloat(validated.internal_humidity_2) * 0.5)) / 2
        // co2 = co2
        measured.co2 = 500
    }
    console.log(`Here is the Calculated Measured!!! Big Step, Woop Woop`)
    console.log(measured);
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