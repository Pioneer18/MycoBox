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
const { environmentManager } = require("../../services/system.service/system.service")
const { set_environment_state } = require("../sensors.controller/sensors.controller")
module.exports = {

    /**
    * Steps:
    * - Check the MycoBox 'System Status': If session already running then return error: session already active
    * - set the environment configuration
    * - Set the environment state with the sensors.controller
    * - Start this sessions environment manager
    */
    newSession: async (config) => {
        try {// start the new session
            if (!process.env.session_state.active_session) {
                // console.log(`Starting session ${process.env.session_state.session_title} - ${process.env.session_state.session_id}`);
                // await this.setEnvironmentConfig(config);
                // await set_environment_state();
                // await environmentManager();
                console.log(config);
                return 'tee-hee'
            } else {
                throw new Error('There is already an active session')
            }
        } catch (err) {
            console.log(`Failed to start a new session - Error: ${err}`)
        }

    },

    endSession: () => {
        return { TODO: 'build this handler' }
    },

    addHoursToSession: () => {
        return { TODO: 'build this handler' }
    },

    subtractHoursFromSession: () => {
        return { TODO: 'build this handler' }
    },

    /**
     * map the user submitted configuration to the envrionment_conig
     * @param {
     *  spawn_running: {
     *    ir_temp_trigger: boolean,
     *    timer: number || null,
     *    temp_setpoint: number,
     *    humidity_setpoint: numbert
     *    co2_setpoint: number,
     *    circulation_top_setpoint: number,
     *    circulation_bottom_setpoint: number,
     *    lighting_setpoint: number,
     *  },
     *  primordia_init: {
     *    user_confirmed: boolean,
     *    timer: number || null,
     *    temp_setpoint: number,
     *    humidity_setpoint: number,
     *    co2_setpoint: number,
     *    circulation_top_setpoint: number,
     *    circulation_bottom_setpoint: number,
     *    lighting_setpoint: number,
     *  },
     *  fruiting: {
     *    timer_and_user_confirmed: boolean,
     *    timer: number || null,
     *    temp_setpoint: number,
     *    humidity_setpoint: number,
     *    co2_setpoint: number,
     *    circulation_top_setpoint: number,
     *    circulation_bottom_setpoint: number,
     *  },
     * } config data from the submitted configuration form
     */
    setEnvironmentConfig: async (config) => {
        process.env.environment_config.spawn_running.temp_setpoint = config.spawn_running.temp_setpoint;
        process.env.environment_config.spawn_running.irTemp_setpoint = config.spawn_running.irTemp_setpoint;
        process.env.environment_config.spawn_running.humidity_setpoint = config.spawn_running.humidity_setpoint;
        process.env.environment_config.spawn_running.co2_setpoint = config.spawn_running.co2_setpoint;
        process.env.environment_config.spawn_running.circulation_top = config.spawn_running.circulation_top;
        process.env.environment_config.spawn_running.circulation_bottom = config.spawn_running.circulation_bottom;
        process.env.environment_config.spawn_running.lighting_setpoint = config.spawn_running.lighting_setpoint;
        process.env.environment_config.primordia_init.temp_setpoint = config.primordia_init.temp_setpoint;
        process.env.environment_config.primordia_init.humidity_setpoint = config.primordia_init.humidity_setpoint;
        process.env.environment_config.primordia_init.co2_setpoint = config.primordia_init.co2_setpoint;
        process.env.environment_config.primordia_init.circulation_top_setpoint = config.primordia_init.circulation_top_setpoint;
        process.env.environment_config.primordia_init.circulation_bottom_setpoint = config.primordia_init.circulation_bottom_setpoint;
        process.env.environment_config.primordia_init.lighting_setpoint = config.primordia_init.lighting_setpoint;
        process.env.environment_config.fruiting.temp_setpoint = config.fruiting.temp_setpoint;
        process.env.environment_config.fruiting.humidity_setpoint = config.fruiting.humidity_setpoint;
        process.env.environment_config.fruiting.co2_setpoint = config.fruiting.co2_setpoint;
        process.env.environment_config.fruiting.circulation_top_setpoint = config.fruiting.circulation_top_setpoint;
        process.env.environment_config.fruiting.circulation_bottom_setpoint = config.fruiting.circulation_bottom_setpoint;
        process.env.environment_config.fruiting.lighting_setpoint = config.fruiting.lighting_setpoint;
    }
}

