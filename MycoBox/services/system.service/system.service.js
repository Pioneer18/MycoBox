/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const { temp_pid_controller_config, update_temperature } = require("../../controllers/environment.manager/temperature.controller");
const { humidity_pid_controller_config, update_humidity } = require("../../controllers/environment.manager/humidity.controller");
const { get, set_session_state, set_test_config } = require("../../globals/globals")
const { update_environment_state, read_environment_state } = require("../../controllers/sensors.controller/sensors.controller");
const { s5r2_on, s3r1_on } = require("../../cli_control_panel/relay");
const { send_command, send_all_commands, send_overrides, shut_off } = require("../../utilities");
const { test_logger } = require("../../logs/logger");
const log = console.log;
const chalk = require("chalk");


/**
 * Responsibilities: Calls Promises 
 * i. coordinates through three session stages
 * ii. maintain PID states
 * iii. call each EM PID
 * iv. log data to db (SSD, Online)
 * ---------------------------------------------
 * Test Mode:
 * @ choice: reference difference from dlo || reach steady state => to stop
 * i. increment globals.session_state.cycles_count
 * ii. set active_test_session false if cycles_count reached cycles_limit
 * iii. apply overrides and not PID controller ouputs
 * iv. log data to test file on each cycle
 * v. return tuning parameters from completed test data
 */
const environment_manager = (mode, resolver) => {
    // #1. Validate the session is still active and THEN
    return new Promise(function (resolve, reject) {
        validate_active_session(mode)
            .then(validation => {
                // #2. Process the current session_state, and don't do anything until its done

                // #3. calculate measured and generate pid_configs when valid env_state returned
                if (validation) {
                    console.log('Environment Manager Has Validated Session')
                    run_pid_controllers(mode)
                        .then(() => {
                            console.log('#######################')
                            console.log('Recalling ENV MANAGER')
                            console.log('#######################')
                            if (mode === 'TEST') {
                                get('test_config')
                                    // determine continue or end test
                                    .then(state => {
                                        log(chalk.greenBright(JSON.stringify(state, null, '  ')))
                                        // select terminator based on test config
                                        process_cycle_count(state)
                                        // check PV - DLO abs difference
                                        // check if steady state detected
                                    })
                                    .then(() => test_logger())
                                    .then(() => environment_manager('TEST', resolve));
                            }

                            if (mode === 'LIVE') {
                                // log data to db (ssd / online)
                                // check stage
                                // Call next EM cycle
                                setTimeout(() => {
                                    environment_manager('LIVE');
                                }, 1000);
                            }
                        })

                }
                if (!validation) {
                    console.log('EM Will Stop Running Now')
                    // turn off relay and send off commands
                    shut_off()
                        .then(() => resolver())
                        .then(() => resolve())
                    // resolver('The real resolve?');

                }
            })
            .catch(err => console.log("Error With the EM"))
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
const run_pid_controllers = (mode) => {
    console.log('Running PID Controllers')
    return new Promise((resolve) => {
        validate_env_state(mode)
            .then(validation => {
                if (validation.validation) {
                    console.log('Validation Has Cleared!!!')
                    const measured = map_measured(validation.env_state);
                    // =========================================================================================================
                    // todo: check for session stage (sr, pi, fr) 
                    get_state()
                        .then(state => {
                            // ** IF TEST MODE: each pid will run but not send a command; instead override commands are sent after pid's run
                            // pass correct stage to the pid controllers to select the correct env_config, different setpoints for each stage!
                            const temp_config = temp_pid_controller_config(measured, state[0].spawn_running, state[2].temperature)
                            const humidity_config = humidity_pid_controller_config(measured, state[0].spawn_running, state[2].humidity)
                            // const ventilation_config = ventilation_pid_controller_config(measure, state[0].spawn_running, state[2].ventilation)
                            // const circulation_config = circulation_controller_config(measured, state[0].spawn_running, state[2].ventilation)
                            update_temperature(temp_config, mode)
                                .then(update_humidity(humidity_config, mode))
                            //.then(update_ventilation(ventilation_config))
                            //.then(update_circulation(circulation_config))

                            // OVERRIDES: I'm replacing this with a service!
                            // send commands
                            // switch relay
                            send_overrides()
                                .then(() => {
                                    s5r2_on()
                                    s3r1_on()
                                    console.log("=======================================")
                                    console.log("Sent Overrides: ")
                                    console.log("=======================================")
                                    resolve()
                                })
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
const validate_env_state = (mode) => {
    console.log('METHOD CALL: validate_env_state')
    // get the latet environment state
    return new Promise((resolve) => {
        update_environment_state(mode)
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
                                update_environment_state(mode)
                                validate_env_state()
                            }
                            else {
                                console.log('ENV HAS BEEN Validated?????')
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
 * also allow test sessions
 * @returns true or false
 */
const validate_active_session = (mode) => {
    return new Promise((resolve) => {
        get('session_state')
            .then(session_state => {
                if (session_state.active_session && mode === 'LIVE') resolve(true)
                if (session_state.active_test_session && mode === 'TEST') resolve(true)
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

const process_cycle_count = (state) => {
    if (state.cycles_limit <= state.cycles_count) {
        console.log('TIME TO END THE SESSION!!!')
        set_session_state('active_test_session', false);
        set_test_config('cycles_count', 0);
        set_test_config('cycles_limit', 0);
    }
    else {
        console.log("Cycles Count: " + state.cycles_count +
            "\nCycles Limit: " + state.cycles_limit);
        state.cycles_count++
    }
}

module.exports = {
    environment_manager
}