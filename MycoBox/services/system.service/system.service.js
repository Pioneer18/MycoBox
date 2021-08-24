/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const { get } = require("../../globals/globals")

/**
 * Responsibilities: 
 * i. coordinates through three session stages
 * ii. maintain PID states
 * iii. call each EM PID
 * process:
 * 2) get the environment_config (setpoints), env_state, and the pid_state from globabls
 * 3) calculate measured from environment_state
 * 4) pass the setpoints and measured to each PID
 */
const environment_manager = async () => {
    console.log('starting the EM')
    // #1. while 'trigger' loops & timers

        // #3. calculate measured and generated a pid_config WHEN valid env_state returned
        console.log('Method Call: generate_pid_configs (Generate PID Config)');
        await generate_pid_configs();
    
}

/**
 * Return the env_config, env_state, and pid_states
 * @returns 
 */
const get_state = async () => {
    console.log("Method Call: get_state")
    return {
        env_config: await get('environment_config'),
        env_state: await get('environment_state'),
        pid_state: await get('pid_state')
    }
}

/**
 * Average the temperature and humidity
 * @param {*} env_state 
 * @returns { temp, humidity, co2 }  
 */
const generate_pid_configs = async () => {
     // #2. get the state
    const { env_config, env_state, pid_state } = await get_state();

    console.log("Method Call: validate_env_state (Block till valid env_state returned) ---------------------------------------------------------------------------")
    const validated = await validate_env_state(env_state)
    
    let measured = { temperature: 1, humidity: 1, co2: 1 }
    if (validated === true) {
        console.log('Validation Cleared Inside of `generate_pid_configs`: Now returning a valid measurement')
        // temperature = t1(.2222) * t2(.2222) * t3(.2222) *pTemp(.3333) / 4
        measured.temperature = ((parseFloat(env_state.internal_temp_1)) + (parseFloat(env_state.internal_temp_2) ) + (parseFloat(env_state.precise_temp_c))) / 3
        // humidity = h1(.2222) * h2(.2222) * h3(.2222) / 3
        measured.humidity = ((parseFloat(env_state.internal_humidity_1)) + (parseFloat(env_state.internal_humidity_2))) / 2
        // co2 = co2
        measured.co2 = 500
        // =========================================================================================================
        console.log('A Valid Measured')
        console.log(measured);
        // create configs for each PID controller 
        // todo: 1) check for session stage (sr, pi, fr) 
        console.log('Method Call: create_tpc_config')
        const config = await create_tpc_config(measured, env_config.spawn_running, pid_state.temperature)
        console.log("Here is a PID ready config: ")
        console.log(config);
        console.log('This is where the train ends, validate_env_state was the trailing callback to be completed');
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
        setTimeout(async () => {
            await generate_pid_configs();
        }, 8000);
    }
    if (env_state.internal_temp_1 === '') {
        console.log('Validate Env Recall: Blank Env State')
        setTimeout(async () => {
            await generate_pid_configs();
        }, 4000);
    }
    if (env_state.internal_temp_1 !== '' && env_state.external_humidity !== '') {
        console.log('Valid Env State!')
        console.log(env_state);
        return true
    }
    return;
}

/**
 * Create TemperauturePidController config
 * Todo: move this to the temperaturePidController
 */
const create_tpc_config = async (measured, env_config, pid_state) => {
    console.log('Environment Config')
    console.log(env_config)
    const config = {
        settings: {
            kp: 1,
            ki: 1,
            kd: 1,
        },
        pid_state: {
            integralOfError: pid_state.integralOfError,
            lastError: pid_state.lastError,
            lastTime:pid_state.lastTime,
        },
        incoming_report: {
            setPoint: env_config.temperature,
            measured: measured.temperature
        }
    }
    return config
}

module.exports = {
    environment_manager
}