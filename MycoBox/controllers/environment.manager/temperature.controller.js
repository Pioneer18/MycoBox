/**
 * Temperature Controller: PID and Overrides
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 * ----------------------
 * How this is going to work: 
 * Could be that the controller calls it everytime with env_sate, and runs the function with the previous report
*/

const { set_pid_state, get } = require('../../globals/globals');
const { TempPidController } = require('../../services/environment.manager/temperature.pid.service');
const { s2r1_off, s2r1_on } = require('../../cli_control_panel/relay');

/**
 * Run PID:
 * Run the PID service with the latest measured value, and any configuration updates
 * @param {
 *  settings: {
 *    kp,
 *    ki,
 *    kd,
 *    iLimit  
 *  },
 *  previousReport: {
 *    integralOfError,
 *    lastError,
 *    lastTime
 *  }
 *  incomingReport: {
 *    setPoint,
 *    measured
 *  } 
 * } config the previous (or initial) report & the incoming
 */
const update_temperature = (config) => {
    // initialize the controller
    const tempController = new TempPidController(config);
    // update the actuator
    const value = tempController.update();
    console.log('The calculated Update Value')
    console.log(value);
    // get the report and set the global
    // const state = tempController.report();
    // console.log('State to set pid_state')
    // console.log(state)
    set_pid_state('temperature', tempController.report())
    temp_actuator_controller(value)
    return value
}

/**
 * Create TemperauturePidController config
 * Todo: move this to the temperaturePidController
 */
const temp_pid_controller_config = (measured, env_config, pid_state) => {
    console.log('Method Call: temp_pid_controller_config')
    const config = {
        settings: {
            kp: 1,
            ki: 0.005,
            kd: 0.005,
        },
        pid_state: {
            integralOfError: pid_state.integralOfError,
            lastError: pid_state.lastError,
            lastTime: pid_state.lastTime,
        },
        incoming_report: {
            setPoint: env_config.temperature,
            measured: measured.temperature
        }
    }
    return config
}

/**
 * Override:
 * Purpose: Manually switch the acuator on or off if OVERRIDE is true
 * Description: Commands the selected actuator to turn on/off regardless of the global context (EnvModel, SystemStatus, ...)
 * @param {string, string} command {actuator: '', status: ''}
 */
const override = (command) => {
    switch (command.actuator) {
        case 'AC':
            if (command.status === 'ON') s1r1_on();
            if (command.status === 'OFF') s1r1_off();
            break;
        case 'HEATER':
            if (command.status === 'ON') s2r1_on();
            if (command.status === 'OFF') s2r1_off();
            break;

        default:
            break;
    }
}

/**
 * Temp Actuator Controller
 * if the update value is greater or equal than +/- 1 from 0 for 3 consecutive readings, then turn on the appropriate acuator and enter 'set mode'
 * once the update value hits within 0.2 of zero or switches positive/negative, stop and don't start until more than or equal to +/-1 from 0 again
 * actuator will stay on till update value can reach .2 of 0, and then it'll switch on again once the update is > or = +/- 1 for 3 consecutive readings
 */
const temp_actuator_controller = (update) => {
    // #1. Check if update is negative, positive, or zero
    const charge = check_sign(update);
    // #2. Check the actuator state
    get('actuators_state')
        // The switch on threshold (st) should be a variable
        .then(state => {
            console.log('Here is the Actuator State 😃')
            console.log(state.ac.stopped)
            if (state.ac.active) {
                console.log(`active: ${active}`)
                // check if update is within .2 of zero +/-
                // if it's within .2 of 0 then switch status to idle 0
                // if it's not within .2 of zero continue in active state
                // if it's more than .2 from zero and in the opposite sign also switch to idle 0    --- Think about this one more
            }
            if (state.ac.stopped) {
                console.log('temp_actuator_controller: STOPPED')
                // check update proximity to zero
                // if beyond +/- 1 turn on the appropriate actuator and set state as 'active'
                // heater for +1
                // ac for -1
                // if within +/-1 of zero do nothing
            }
            if (state.ac.idle) {
                console.log(`idle: ${idle}`)
                // check if update is within .2 of 0
                // if it is, check if idle equals 3
                // if it does switch state to 'stopped' and switch off the actuator
                // otherwise increment and continue
                // if it's outside of .2, reset idle to 0 and switch state to active
            }
        })
}

/**
 * Check if the update value (num) is negative, positive, or exactly 0 
 */
const check_sign = (num) => {
    console.log('temp_actuator_controller: checking update value`s sign: positive or negative')
    if (Math.round((num + Number.EPSILON) * 100) / 100 < 0) return false
    if (Math.round((num + Number.EPSILON) * 100) / 100 > 0) return true
    if (Math.round((num + Number.EPSILON) * 100) / 100 === 0) return 0
}

/**
 * 
 * @param {*} update 
 * @returns
 * 0: update is 0
 * 1: negative within .2
 * 2: positive within .2
 * 3: negative outside .2
 * 4: positive outside .2
 */
const zero_point_two_check = (update) => {
    // check the sign
    const sign = check_sign(update)
    // check if within .2 for sign
    switch (sign) {
        // positive sign
        case true:
            console.log('Zero Point Two Check: Positive Sign')
            // within .2 of zero
            if (update >= 0 && update <= 0.2) {
                console.log('Within 0.2')
                return 2
            }
            // more than .2 from zero
            if (update > 0.2) {
                console.log('Outside 0.2')
                return 4
            }
            break;
        // negative sign
        case false:
            console.log('Zero Point Two Check: Negative Sign')
            // within .2 of zer0
            if (update > -0.2 && update <= 0) {
                console.log('Within 0.2')
                return 1
            }
            // more than .2 from zero
            if (update) {
                console.log('Outside 0.2')
                return 3
            }
            break;
        // update is 0    
        case 0:
            console.log('Zero Point Two Check: Update is 0')
            // if the sign is exactly zero
            return 0
        // default
        default:
            break;
    }
}


module.exports = {
    update_temperature,
    temp_pid_controller_config,
    override
}


