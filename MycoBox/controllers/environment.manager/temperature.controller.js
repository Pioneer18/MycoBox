/**
 * Temperature Controller: PID and Overrides
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 * ----------------------
 * How this is going to work: 
 * Could be that the controller calls it everytime with env_sate, and runs the function with the previous report
*/

const { s1r1_on, s1r1_off, s2r1_off, s2r1_on } = require('../../cli_control_panel/relay');
const { set_pid_state } = require('../../globals/globals');
const { TempPidController } = require('../../services/environment.manager/temperature.pid.service');


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
        set_pid_state('temperature', tempController.report())
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


module.exports = {
    update_temperature,
    temp_pid_controller_config,
    override
}


