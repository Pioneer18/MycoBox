/**
 * Temperature Controller: PID and Overrides
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 * ----------------------
 * How this is going to work: 
 * Could be that the controller calls it everytime with env_sate, and runs the function with the previous report
*/

const { set_pid_state } = require('../../globals/globals');
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
    /**
     * note: acuators have states: active, stopped (instant it happens), idle
     * 
     * if update value is greater or equal to +/- 1 turn on the corresponding actuator and set it's state as active
     *   - this is the first check level, with a default response
     * once the update value hits within 0.2 of zero for 2 counts (and actuator has been active), or switches positive/negative, stop and don't start until more than or equal to +/-1 from 0 again
     *   - on first reading that hits with +/- 0.2 of zero, set the stopped count to 1; and stop the actuator of course
     *   - for the next 2 readings (18 seconds), if the update value is +/- 1 from zero reset stopped to 0 and set idle as true
     */

    const charge = check_charge(update);
    // get the actuator state now please
    // apply additional logic to below
    if (!charge) {
        // turn on the ac and set active
        console.log('Switching on the AC!')
        s2r1_on()
    }
    if (charge) {
        // turn on the heater and set active
        console.log('Switching off the AC!')
        s2r1_off()
    }
    if (charge === 0) {
        console.log('No Temp Acuators on')
        // turn AC and Heater off
        s2r1_off()
    }
    return
}

/**
 * @param {number} num is the update value 
 * @returns true, false, or 0
 */
const check_charge = (num) => {
    console.log('$$$$$$$$$$$$$ Checking Charge $$$$$$$$$$$$$')
    console.log(Math.round((num + Number.EPSILON) * 100) / 100)
    if (Math.round((num + Number.EPSILON) * 100) / 100 === 0) return 0
    if (Math.round((num + Number.EPSILON) * 100) / 100 < 0) return false
    if (Math.round((num + Number.EPSILON) * 100) / 100 > 0) return true
}


module.exports = {
    update_temperature,
    temp_pid_controller_config,
    override
}


